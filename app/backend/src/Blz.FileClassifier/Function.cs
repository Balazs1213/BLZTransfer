using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;
using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

// Assembly attribute a JSON szerializációhoz
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.FileClassifier
{
    public class Function
    {
        private static readonly AmazonDynamoDBClient _dynamoDbClient = new AmazonDynamoDBClient();
        private const string TableName = "blz-files-table";

        public async Task<object> FunctionHandler(JsonElement inputEvent, ILambdaContext context)
        {
            context.Logger.LogLine($"Classifier received event: {inputEvent.GetRawText()}");

            // 1. Kulcs kinyerése
            string? fileKey = inputEvent.TryGetProperty("key", out var keyElem) ? keyElem.GetString() : null;

            if (string.IsNullOrEmpty(fileKey))
            {
                throw new Exception("Missing file key for classification!");
            }

            // 2. Kategória meghatározása kiterjesztés alapján
            string extension = string.Empty;
            int lastDotIndex = fileKey.LastIndexOf('.');
            if (lastDotIndex >= 0)
            {
                extension = fileKey.Substring(lastDotIndex + 1).ToLower();
            }

            string category = "OTHER";
            var imageExtensions = new List<string> { "jpg", "jpeg", "png", "bmp" };
            var documentExtensions = new List<string> { "pdf", "tiff", "doc", "docx", "txt" };
            var videoExtensions = new List<string> { "mp4", "avi", "mov", "mkv" };

            if (imageExtensions.Contains(extension))
            {
                category = "IMAGE";
            }
            else if (documentExtensions.Contains(extension))
            {
                category = "DOCUMENT";
            }
            else if (videoExtensions.Contains(extension))
            {
                category = "VIDEO";
            }

            // 3. UserId kinyerése a kulcsból (userId/filename.ext)
            string[] parts = fileKey.Split('/');
            string userId = parts.Length > 1 ? parts[0] : "guest";

            context.Logger.LogLine($"Classified {fileKey} as {category}. Updating DynamoDB...");

            // 4. DynamoDB frissítése (A KORÁBBI BUG JAVÍTVA: category-ként mentjük)
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

            // 5. Bucket kinyerése a Step Functions lánchoz (biztonsági fallback-ekkel)
            string bucket = "default-bucket";
            if (inputEvent.TryGetProperty("cleanBucket", out var cleanBucketElem))
            {
                bucket = cleanBucketElem.GetString() ?? bucket;
            }
            else if (inputEvent.TryGetProperty("bucket", out var bucketElem))
            {
                bucket = bucketElem.GetString() ?? bucket;
            }

            // 6. Visszatérés a Step Functions számára a megfelelő formátumban
            return new
            {
                key = fileKey,
                category = category,
                bucket = bucket
            };
        }
    }
}