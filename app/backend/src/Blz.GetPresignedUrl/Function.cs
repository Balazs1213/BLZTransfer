using System;
using System.Collections.Generic;
using System.Threading.Tasks; // Ez kell az async miatt
using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.DynamoDBv2;       // DynamoDB csomag
using Amazon.DynamoDBv2.Model; // DynamoDB csomag

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.GetPresignedUrl;

public class Function
{
    private readonly IAmazonS3 _s3Client;
    private readonly IAmazonDynamoDB _dynamoDbClient;
    private readonly string _bucketName = "blz-quarantine-bucket-w1srf8"; 
    private readonly string _tableName = "blz-files-table"; 

    public Function()
    {
        _s3Client = new AmazonS3Client();
        _dynamoDbClient = new AmazonDynamoDBClient(); 
    }
    // Figyeld meg: async Task lett a visszatérési érték!
    public async Task<UploadResponse> FunctionHandler(UploadRequest request, ILambdaContext context)
    {
        try
        {
            if (string.IsNullOrEmpty(request.FileName))
            {
                throw new Exception("FileName is missing from the request.");
            }

            // Ha a frontend nem küld UserId-t, alapértelmezetten "guest" lesz
            var userId = string.IsNullOrEmpty(request.UserId) ? "guest" : request.UserId;
            var uniqueFileName = $"{userId}/{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{request.FileName}";
            // 1. Pre-signed URL generálása (Maradt az eredeti logika)
            var urlRequest = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = uniqueFileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(5) 
            };

            string presignedUrl = _s3Client.GetPreSignedURL(urlRequest);
            context.Logger.LogInformation($"Successfully generated pre-signed URL for: {uniqueFileName}");

            // 2. Bejegyzés írása a DynamoDB-be
            var item = new Dictionary<string, AttributeValue>
            {
                { "userId", new AttributeValue { S = userId } },                   // Partíciós kulcs
                { "fileName", new AttributeValue { S = uniqueFileName } },         // Rendezési kulcs (Sort key)
                { "originalName", new AttributeValue { S = request.FileName } },   // Az eredeti fájlnév
                { "fileSize", new AttributeValue { N = request.FileSize.ToString() } }, // Szám (N) típus
                { "uploadDate", new AttributeValue { S = DateTime.UtcNow.ToString("o") } }, // ISO 8601 dátum
                { "status", new AttributeValue { S = "Scanning" } }                // Kezdeti állapot
            };

            var putRequest = new PutItemRequest
            {
                TableName = _tableName,
                Item = item
            };

            await _dynamoDbClient.PutItemAsync(putRequest);
            context.Logger.LogInformation($"Successfully written to DynamoDB: {uniqueFileName} for user {userId}");

            // 3. Válasz visszaküldése a Reactnak
            return new UploadResponse
            {
                Message = "Success",
                FileName = uniqueFileName,
                UploadUrl = presignedUrl
            };
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Error: {ex.Message}");
            throw; 
        }
    }
}

public class UploadRequest
{
    public string? FileName { get; set; }
    public long FileSize { get; set; }
    public string? UserId { get; set; } 
}

public class UploadResponse
{
    public string? Message { get; set; }
    public string? FileName { get; set; }
    public string? UploadUrl { get; set; }
}