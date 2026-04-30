using System;
using System.IO;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Xunit;

namespace Blz.IntegrationTests;

public class FileUploadTests
{
    // --- ⚠️ AWS RESOURCE NAMES ⚠️ ---
    private const string QuarantineBucket = "blz-quarantine-bucket-w1srf8";
    private const string CleanBucket = "blz-clean-bucket-w1srf8";
    private const string DynamoDbTableName = "blz-files-table";
    private const string TestUserId = "247814b8-6001-70a4-8158-b3928c372d3b";

    private readonly IAmazonS3 _s3Client;
    private readonly IAmazonDynamoDB _dynamoClient;

    public FileUploadTests()
    {
        // Initialize AWS SDK clients for the test environment
        _s3Client = new AmazonS3Client();
        _dynamoClient = new AmazonDynamoDBClient();
    }

    [Fact]
    public async Task HappyPath_UploadLocalTextFile_ShouldProcessAndMoveToCleanBucket()
    {
        // ==========================================
        // 1. ARRANGE
        // ==========================================
        
        // Build the absolute path to the local test file
        var localFilePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../file-for-tests/documents/test.txt"));
        Assert.True(File.Exists(localFilePath), $"Test file not found at the specified path: {localFilePath}");

        // Generate a unique filename and the corresponding S3 Key (which includes the UserId prefix)
        var uniqueFileName = $"test-upload-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}.txt";
        var s3Key = $"{TestUserId}/{uniqueFileName}";

        // ==========================================
        // 2. ACT
        // ==========================================
        
        // Upload the test file to the Quarantine bucket
        using (var stream = new FileStream(localFilePath, FileMode.Open, FileAccess.Read))
        {
            var putRequest = new PutObjectRequest
            {
                BucketName = QuarantineBucket,
                Key = s3Key,
                InputStream = stream
            };
            await _s3Client.PutObjectAsync(putRequest);
        }

        // ==========================================
        // 3. WAIT & ASSERT (Dynamic Polling)
        // ==========================================
        
        int maxRetries = 24; // 24 tries * 5 seconds = max 120 seconds (2 minutes) timeout
        int delayBetweenRetriesMs = 5000; // 5 seconds
        bool isSuccessfullyProcessed = false;
        Document? finalDocument = null;

        // Configure the DynamoDB table definition (matching the exact schema from your Lambda)
        var table = new TableBuilder(_dynamoClient, DynamoDbTableName)
            .AddHashKey("userId", DynamoDBEntryType.String)    
            .AddRangeKey("fileName", DynamoDBEntryType.String) 
            .Build();

        // Start polling
        for (int i = 0; i < maxRetries; i++)
        {
            // Delay first to give AWS Step Functions time to process
            await Task.Delay(delayBetweenRetriesMs);

            // A) Check DynamoDB
            // CRITICAL FIX: The Lambda saves the full 's3Key' (userId/filename.txt) into the 'fileName' column!
            finalDocument = await table.GetItemAsync(TestUserId, s3Key);

            // B) Check S3 Clean Bucket
            bool fileExistsInCleanBucket = false;
            try
            {
                var metadataRequest = new GetObjectMetadataRequest { BucketName = CleanBucket, Key = s3Key };
                await _s3Client.GetObjectMetadataAsync(metadataRequest);
                fileExistsInCleanBucket = true; // No exception means the file has arrived!
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                // File not there yet, the loop will retry
            }

            // If BOTH conditions are met, the file processing is fully complete!
            if (finalDocument != null && fileExistsInCleanBucket)
            {
                isSuccessfullyProcessed = true;
                break; // Exit the polling loop immediately
            }
        }

        // Final Asserts
        Assert.True(isSuccessfullyProcessed, $"The file did not arrive in the Clean bucket or DynamoDB within the {(maxRetries * delayBetweenRetriesMs) / 1000} second timeout limit.");
        Assert.NotNull(finalDocument); // Extra safety check

        // ==========================================
        // 4. CLEANUP
        // ==========================================
        try 
        {
            // Clean up S3
            await _s3Client.DeleteObjectAsync(CleanBucket, s3Key);
            
            // Optional: Clean up DynamoDB to keep the test environment pristine
            await table.DeleteItemAsync(TestUserId, s3Key);
        } 
        catch 
        {
            // Ignore cleanup errors so they don't fail an otherwise successful test
        }
    }
}