using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Xunit;

namespace Blz.IntegrationTests;

public class AntivirusIntegrationTests
{
    // --- ⚠️ AWS RESOURCE NAMES ⚠️ ---
    private const string QuarantineBucket = "blz-quarantine-bucket-w1srf8";
    private const string CleanBucket = "blz-clean-bucket-w1srf8";
    private const string TestUserId = "247814b8-6001-70a4-8158-b3928c372d3b";

    private readonly IAmazonS3 _s3Client;

    public AntivirusIntegrationTests()
    {
        _s3Client = new AmazonS3Client();
    }

    [Fact]
    public async Task UploadInfectedFile_ShouldBeBlockedAndDeletedFromQuarantine()
    {
        // ==========================================
        // 1. ARRANGE
        // ==========================================
        
        // A hivatalos EICAR tesztvírus string (ez teljesen ártalmatlan, de minden AV riaszt rá)
        string eicarContent = @"X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

        // Generate a recognizable unique filename for the virus test
        var uniqueFileName = $"virus-test-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}.txt";
        var s3Key = $"{TestUserId}/{uniqueFileName}";

        // ==========================================
        // 2. ACT
        // ==========================================
        
        // Upload the INFECTED content directly from MEMORY to bypass local Windows Defender
        using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(eicarContent)))
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
        // 3. WAIT & ASSERT (Dynamic Polling for Deletion)
        // ==========================================
        
        int maxRetries = 24; // 24 tries * 5 seconds = max 120 seconds (2 minutes) timeout
        int delayBetweenRetriesMs = 5000; // 5 seconds
        bool fileDeletedFromQuarantine = false;

        // Start polling: We expect the Antivirus Lambda to intervene and DELETE the file from Quarantine
        for (int i = 0; i < maxRetries; i++)
        {
            await Task.Delay(delayBetweenRetriesMs);

            try
            {
                var metadataRequest = new GetObjectMetadataRequest { BucketName = QuarantineBucket, Key = s3Key };
                await _s3Client.GetObjectMetadataAsync(metadataRequest);
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                // SUCCESS! The file was deleted from the Quarantine bucket by the Antivirus!
                fileDeletedFromQuarantine = true;
                break;
            }
        }

        // Assertion 1: Verify the file was removed from Quarantine
        Assert.True(fileDeletedFromQuarantine, "SECURITY FAILURE: The infected file was NOT deleted from the Quarantine bucket within the timeout limit.");

        // Assertion 2: Crucial Security Check - Ensure the file NEVER reached the Clean bucket
        try
        {
            var cleanMetadataRequest = new GetObjectMetadataRequest { BucketName = CleanBucket, Key = s3Key };
            await _s3Client.GetObjectMetadataAsync(cleanMetadataRequest);
            
            Assert.Fail("CRITICAL SECURITY BREACH: The infected file successfully bypassed the antivirus and reached the Clean bucket!");
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            // Expected behavior: The file should NOT be found in the Clean bucket. Test passes.
            Assert.True(true);
        }
    }
}