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

    private static readonly string[] SupportedTextractExtensions = { "jpg", "jpeg", "png", "pdf", "tiff", "bmp" };

    public Function()
    {
        _textractClient = new AmazonTextractClient();
        _dynamoDbClient = new AmazonDynamoDBClient();
        _tableName = Environment.GetEnvironmentVariable("DYNAMODB_TABLE_NAME") ?? "blz-files-table";
    }

    public async Task<TextractAnalyzeResponse> FunctionHandler(JsonElement requestEvent, ILambdaContext context)
    {
        var input = ParseEvent(requestEvent);
        var userId = ExtractUserIdFromKey(input.Key ?? string.Empty);
        string safeText = string.Empty;
        string status = "Analyzed";
        bool wasTruncated = false;

        try
        {
            if (string.IsNullOrWhiteSpace(input.Bucket) || string.IsNullOrWhiteSpace(input.Key))
            {
                throw new Exception("The input event must include non-empty 'bucket' and 'key' values.");
            }

            string extension = string.Empty;
            int lastDotIndex = input.Key.LastIndexOf('.');
            if (lastDotIndex >= 0)
            {
                extension = input.Key.Substring(lastDotIndex + 1).ToLower();
            }

            if (SupportedTextractExtensions.Contains(extension))
            {
                context.Logger.LogInformation($"Starting Textract analysis for: {input.Key}");
                
                try 
                {
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
                catch (UnsupportedDocumentException ex)
                {
                    context.Logger.LogWarning($"Unsupported format: {ex.Message}");
                    safeText = $"[Error: Unsupported or corrupted file format (.{extension})]";
                    status = "AnalysisFailed";
                }
                catch (BadDocumentException ex)
                {
                    context.Logger.LogWarning($"Bad document: {ex.Message}");
                    safeText = "[Error: The document is corrupted or unreadable]";
                    status = "AnalysisFailed";
                }
                catch (DocumentTooLargeException)
                {
                    safeText = "[Error: Document exceeds Textract size limits]";
                    status = "AnalysisFailed";
                }
            }
            else
            {
                context.Logger.LogInformation($"Skipping Textract. Extension '{extension}' not supported.");
                safeText = $"[Text extraction skipped: .{extension} is not handled by Textract]";
            }
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Failure: {ex.Message}");
            safeText = $"[System Error: {ex.Message}]";
            status = "SystemError";
        }

        await UpdateDatabase(userId, input.Key ?? string.Empty, safeText, status, input.Category, input.Bucket, context);

        return new TextractAnalyzeResponse
        {
            Message = status == "Analyzed" ? "Analysis completed" : "Analysis failed/skipped",
            UserId = userId,
            FileName = input.Key,
            Bucket = input.Bucket,
            Category = input.Category ?? "DOCUMENT",
            ExtractedLength = safeText.Length,
            Truncated = wasTruncated
        };
    }

    private async Task UpdateDatabase(string userId, string key, string text, string status, string? category, string? bucket, ILambdaContext context)
    {
        var updateRequest = new UpdateItemRequest
        {
            TableName = _tableName,
            Key = new Dictionary<string, AttributeValue>
            {
                { "userId", new AttributeValue { S = userId } },
                { "fileName", new AttributeValue { S = key } }
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
                { ":status", new AttributeValue { S = status } },
                { ":text", new AttributeValue { S = text } },
                { ":analysisDate", new AttributeValue { S = DateTime.UtcNow.ToString("o") } },
                { ":category", new AttributeValue { S = category ?? "DOCUMENT" } },
                { ":sourceBucket", new AttributeValue { S = bucket ?? "unknown" } }
            }
        };

        await _dynamoDbClient.UpdateItemAsync(updateRequest);
    }

    private static TextractEvent ParseEvent(JsonElement requestEvent)
    {
        if (requestEvent.ValueKind != JsonValueKind.Object)
            throw new Exception("Invalid event format.");

        if (requestEvent.TryGetProperty("body", out var bodyElement) && bodyElement.ValueKind == JsonValueKind.String)
        {
            var body = bodyElement.GetString();
            if (!string.IsNullOrWhiteSpace(body))
            {
                var parsedBody = JsonSerializer.Deserialize<TextractEvent>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (parsedBody is not null) return parsedBody;
            }
        }

        return requestEvent.Deserialize<TextractEvent>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) 
               ?? throw new Exception("Could not deserialize input.");
    }

    public static string BuildTextFromLineBlocks(List<Block>? blocks)
    {
        if (blocks is null || blocks.Count == 0) return string.Empty;

        var lines = blocks
            .Where(block => string.Equals(block.BlockType, "LINE", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(block.Text))
            .Select(block => block.Text!.Trim());

        return string.Join('\n', lines);
    }

    public static string ApplySafetyLimit(string text, out bool wasTruncated)
    {
        text ??= string.Empty;
        if (text.Length <= MaxExtractedTextLength)
        {
            wasTruncated = false;
            return text;
        }
        wasTruncated = true;
        return text.Substring(0, MaxExtractedTextLength - TruncatedSuffix.Length) + TruncatedSuffix;
    }

    public static string ExtractUserIdFromKey(string key)
    {
        if (string.IsNullOrWhiteSpace(key)) return "guest";
        var parts = key.Split('/', StringSplitOptions.RemoveEmptyEntries);
        return parts.Length > 1 ? parts[0] : "guest";
    }
}

public class TextractEvent { public string? Key { get; set; } public string? Bucket { get; set; } public string? Category { get; set; } }
public class TextractAnalyzeResponse { public string? Message { get; set; } public string? UserId { get; set; } public string? FileName { get; set; } public string? Bucket { get; set; } public string? Category { get; set; } public int ExtractedLength { get; set; } public bool Truncated { get; set; } }