using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.Core;
using Amazon.Textract;
using Amazon.Textract.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.TextractAnalyzer;

public class Function
{
    private const int MaxExtractedTextLength = 1000;
    private const string TruncatedSuffix = "... [TRUNCATED]";

    private readonly IAmazonTextract _textractClient;
    private readonly IAmazonDynamoDB _dynamoDbClient;
    private readonly string _tableName;

    // A Textract által hivatalosan támogatott kiterjesztések
    private static readonly string[] SupportedTextractExtensions = { "jpg", "jpeg", "png", "pdf", "tiff", "bmp" };

    public Function()
    {
        _textractClient = new AmazonTextractClient();
        _dynamoDbClient = new AmazonDynamoDBClient();
        _tableName = Environment.GetEnvironmentVariable("DYNAMODB_TABLE_NAME") ?? "blz-files-table";
    }

    public async Task<TextractAnalyzeResponse> FunctionHandler(JsonElement requestEvent, ILambdaContext context)
    {
        try
        {
            var input = ParseEvent(requestEvent);

            if (string.IsNullOrWhiteSpace(input.Bucket) || string.IsNullOrWhiteSpace(input.Key))
            {
                throw new Exception("The input event must include non-empty 'bucket' and 'key' values.");
            }

            var userId = ExtractUserIdFromKey(input.Key);
            string safeText = string.Empty;
            bool wasTruncated = false;

            // 1. Fájl kiterjesztésének kinyerése a vizsgálathoz
            string extension = string.Empty;
            int lastDotIndex = input.Key.LastIndexOf('.');
            if (lastDotIndex >= 0)
            {
                extension = input.Key.Substring(lastDotIndex + 1).ToLower();
            }

            // 2. Csak akkor hívjuk a Textractot, ha a formátum támogatott
            if (SupportedTextractExtensions.Contains(extension))
            {
                context.Logger.LogInformation($"Starting Textract analysis for supported file: {input.Key}");
                
                var detectRequest = new DetectDocumentTextRequest
                {
                    Document = new Document
                    {
                        S3Object = new Amazon.Textract.Model.S3Object
                        {
                            Bucket = input.Bucket,
                            Name = input.Key
                        }
                    }
                };

                var detectResponse = await _textractClient.DetectDocumentTextAsync(detectRequest);
                var fullText = BuildTextFromLineBlocks(detectResponse.Blocks);
                safeText = ApplySafetyLimit(fullText, out wasTruncated);
            }
            else
            {
                // Ha nem támogatott (pl. .txt), kihagyjuk a Textractot, de nem dobunk hibát!
                context.Logger.LogInformation($"Skipping Textract API call. Extension '{extension}' is not supported.");
                safeText = $"[Text extraction skipped: Unsupported file format (.{extension})]";
            }

            // 3. DynamoDB frissítése (minden esetben lefut, hogy a folyamat ne akadjon meg)
            var updateRequest = new UpdateItemRequest
            {
                TableName = _tableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "userId", new AttributeValue { S = userId } },
                    { "fileName", new AttributeValue { S = input.Key } }
                },
                UpdateExpression = "SET #status = :status, #extractedText = :text, #analysisDate = :analysisDate, #category = :category, #sourceBucket = :sourceBucket",
                ExpressionAttributeNames = new Dictionary<string, string>
                {
                    { "#status", "status" },
                    { "#extractedText", "extractedText" },
                    { "#analysisDate", "analysisDate" },
                    { "#category", "category" },
                    { "#sourceBucket", "sourceBucket" }
                },
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":status", new AttributeValue { S = "Analyzed" } },
                    { ":text", new AttributeValue { S = safeText } },
                    { ":analysisDate", new AttributeValue { S = DateTime.UtcNow.ToString("o") } },
                    { ":category", new AttributeValue { S = input.Category ?? "DOCUMENT" } },
                    { ":sourceBucket", new AttributeValue { S = input.Bucket } }
                }
            };

            await _dynamoDbClient.UpdateItemAsync(updateRequest);

            context.Logger.LogInformation($"Processing completed for '{input.Key}'. Truncated={wasTruncated}, SavedToTable='{_tableName}'.");

            return new TextractAnalyzeResponse
            {
                Message = "Analysis completed",
                UserId = userId,
                FileName = input.Key,
                Bucket = input.Bucket,
                Category = input.Category ?? "DOCUMENT",
                ExtractedLength = safeText.Length,
                Truncated = wasTruncated
            };
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Textract analyzer failed: {ex.Message}");
            throw;
        }
    }

    private static TextractEvent ParseEvent(JsonElement requestEvent)
    {
        if (requestEvent.ValueKind != JsonValueKind.Object)
        {
            throw new Exception("Invalid event format. Expected a JSON object.");
        }

        if (requestEvent.TryGetProperty("body", out var bodyElement) && bodyElement.ValueKind == JsonValueKind.String)
        {
            var body = bodyElement.GetString();
            if (!string.IsNullOrWhiteSpace(body))
            {
                var parsedBody = JsonSerializer.Deserialize<TextractEvent>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (parsedBody is not null)
                {
                    return parsedBody;
                }
            }
        }

        var parsedEvent = requestEvent.Deserialize<TextractEvent>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        return parsedEvent ?? throw new Exception("Could not deserialize input event to TextractEvent.");
    }

    private static string BuildTextFromLineBlocks(List<Block>? blocks)
    {
        if (blocks is null || blocks.Count == 0)
        {
            return string.Empty;
        }

        var lines = blocks
            .Where(block => string.Equals(block.BlockType, "LINE", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(block.Text))
            .Select(block => block.Text!.Trim());

        return string.Join('\n', lines);
    }

    private static string ApplySafetyLimit(string text, out bool wasTruncated)
    {
        text ??= string.Empty;

        if (text.Length <= MaxExtractedTextLength)
        {
            wasTruncated = false;
            return text;
        }

        var maxPrefixLength = Math.Max(0, MaxExtractedTextLength - TruncatedSuffix.Length);
        wasTruncated = true;
        return text[..maxPrefixLength] + TruncatedSuffix;
    }

    private static string ExtractUserIdFromKey(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return "guest";
        }

        var parts = key.Split('/', StringSplitOptions.RemoveEmptyEntries);
        return parts.Length > 1 ? parts[0] : "guest";
    }
}

public class TextractEvent
{
    public string? Key { get; set; }
    public string? Bucket { get; set; }
    public string? Category { get; set; }
}

public class TextractAnalyzeResponse
{
    public string? Message { get; set; }
    public string? UserId { get; set; }
    public string? FileName { get; set; }
    public string? Bucket { get; set; }
    public string? Category { get; set; }
    public int ExtractedLength { get; set; }
    public bool Truncated { get; set; }
}