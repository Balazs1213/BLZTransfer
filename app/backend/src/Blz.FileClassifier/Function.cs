using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;
using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.FileClassifier
{
    public class Function
    {
        private static readonly AmazonDynamoDBClient _dynamoDbClient = new AmazonDynamoDBClient();
        private const string TableName = "blz-files-table";

        public static string GetFileCategory(string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey)) return "OTHER";

            string extension = string.Empty;
            int lastDotIndex = fileKey.LastIndexOf('.');
            if (lastDotIndex >= 0)
            {
                extension = fileKey.Substring(lastDotIndex + 1).ToLower();
            }

            var imageExtensions = new List<string> { "jpg", "jpeg", "png", "bmp" };
            var documentExtensions = new List<string> { "pdf", "tiff", "doc", "docx", "txt" };
            var videoExtensions = new List<string> { "mp4", "avi", "mov", "mkv" };

            if (imageExtensions.Contains(extension)) return "IMAGE";
            if (documentExtensions.Contains(extension)) return "DOCUMENT";
            if (videoExtensions.Contains(extension)) return "VIDEO";

            return "OTHER";
        }

        public async Task<object> FunctionHandler(JsonElement inputEvent, ILambdaContext context)
        {
            context.Logger.LogLine($"Classifier received event: {inputEvent.GetRawText()}");

            string? fileKey = inputEvent.TryGetProperty("key", out var keyElem) ? keyElem.GetString() : null;

            if (string.IsNullOrEmpty(fileKey))
            {
                throw new Exception("Missing file key for classification!");
            }

            string category = GetFileCategory(fileKey);

            string[] parts = fileKey.Split('/');
            string userId = parts.Length > 1 ? parts[0] : "guest";

            context.Logger.LogLine($"Classified {fileKey} as {category}. Updating DynamoDB...");

            var request = new UpdateItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "userId", new AttributeValue { S = userId } },
                    { "fileName", new AttributeValue { S = fileKey } }
                },
                UpdateExpression = "SET category = :cat",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":cat", new AttributeValue { S = category } }
                }
            };

            await _dynamoDbClient.UpdateItemAsync(request);

            string bucket = "default-bucket";
            if (inputEvent.TryGetProperty("cleanBucket", out var cleanBucketElem))
            {
                bucket = cleanBucketElem.GetString() ?? bucket;
            }
            else if (inputEvent.TryGetProperty("bucket", out var bucketElem))
            {
                bucket = bucketElem.GetString() ?? bucket;
            }

            return new
            {
                key = fileKey,
                category = category,
                bucket = bucket
            };
        }
    }
}