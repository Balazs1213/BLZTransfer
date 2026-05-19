using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.GetDownloadUrl;

public class Function
{
	private const string TableName = "blz-files-table";
	private const string BucketName = "blz-clean-bucket-w1srf8";

	private static readonly Dictionary<string, string> CorsHeaders = new()
	{
		["Access-Control-Allow-Origin"] = "*",
		["Access-Control-Allow-Headers"] = "*",
		["Access-Control-Allow-Methods"] = "*",
		["Content-Type"] = "application/json"
	};

	private readonly IAmazonDynamoDB _dynamoDbClient;
	private readonly IAmazonS3 _s3Client;

	public Function()
		: this(new AmazonDynamoDBClient(), new AmazonS3Client())
	{
	}

	public Function(IAmazonDynamoDB dynamoDbClient, IAmazonS3 s3Client)
	{
		_dynamoDbClient = dynamoDbClient;
		_s3Client = s3Client;
	}

	public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(
		APIGatewayHttpApiV2ProxyRequest request,
		ILambdaContext context)
	{
		try
		{
            if (request.RequestContext?.Http?.Method == "OPTIONS")
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    StatusCode = 200,
                    Headers = new Dictionary<string, string>
                    {
                        ["Access-Control-Allow-Origin"] = "*",
                        ["Access-Control-Allow-Headers"] = "*",
                        ["Access-Control-Allow-Methods"] = "*"
                    }
                };
            }
            
			var payloadResult = ParseRequest(request);
			if (!payloadResult.IsValid)
			{
				context.Logger.LogInformation($"Invalid request payload: {payloadResult.ErrorMessage}");
				return CreateResponse(400, new { message = payloadResult.ErrorMessage });
			}

			var payload = payloadResult.Payload!;
			context.Logger.LogInformation($"Incoming request values: fileName={payload.FileName}, userId={payload.UserId}, maxDownloads={payload.MaxDownloads}");
			context.Logger.LogInformation($"Generating download URL for userId={payload.UserId}, fileName={payload.FileName}, expiresInMinutes={payload.ExpiresInMinutes}");

			var getItemResponse = await _dynamoDbClient.GetItemAsync(new GetItemRequest
			{
				TableName = TableName,
				Key = new Dictionary<string, AttributeValue>
				{
					["userId"] = new AttributeValue { S = payload.UserId },
					["fileName"] = new AttributeValue { S = payload.FileName }
				}
			});

			if (getItemResponse.Item == null || getItemResponse.Item.Count == 0)
			{
				context.Logger.LogInformation($"File record not found for userId={payload.UserId}, fileName={payload.FileName}");
				return CreateResponse(404, new { message = "File not found." });
			}

			var status = GetStringAttribute(getItemResponse.Item, "status", "Status");
			var isAllowedStatus = string.Equals(status, "Clean", StringComparison.OrdinalIgnoreCase)
								  || string.Equals(status, "Analyzed", StringComparison.OrdinalIgnoreCase);

			if (!isAllowedStatus)
			{
				context.Logger.LogInformation($"Download forbidden for userId={payload.UserId}, fileName={payload.FileName}, status={status}");
				return CreateResponse(403, new { message = "Download is not allowed for this file status." });
			}

			context.Logger.LogInformation("Attempting to update DynamoDB...");
			var shareExpiresAtUnix = DateTimeOffset.UtcNow.AddMinutes(payload.ExpiresInMinutes).ToUnixTimeSeconds();
			await _dynamoDbClient.UpdateItemAsync(new UpdateItemRequest
			{
				TableName = TableName,
				Key = new Dictionary<string, AttributeValue>
				{
					["userId"] = new AttributeValue { S = payload.UserId },
					["fileName"] = new AttributeValue { S = payload.FileName }
				},
				UpdateExpression = "SET remainingDownloads = :maxDownloads, shareExpiresAt = :shareExpiresAt",
				ConditionExpression = "attribute_exists(fileName) AND ((attribute_exists(#statusLower) AND (#statusLower = :clean OR #statusLower = :analyzed OR #statusLower = :scanning)) OR (attribute_exists(#statusUpper) AND (#statusUpper = :clean OR #statusUpper = :analyzed OR #statusUpper = :scanning)))",
				ExpressionAttributeNames = new Dictionary<string, string>
				{
					["#statusLower"] = "status",
					["#statusUpper"] = "Status"
				},
				ExpressionAttributeValues = new Dictionary<string, AttributeValue>
				{
					[":maxDownloads"] = new AttributeValue { N = payload.MaxDownloads.ToString() },
					[":shareExpiresAt"] = new AttributeValue { N = shareExpiresAtUnix.ToString() },
					[":clean"] = new AttributeValue { S = "Clean" },
					[":analyzed"] = new AttributeValue { S = "Analyzed" },
					[":scanning"] = new AttributeValue { S = "scanning" }
				}
			});

            string encodedFileName = Uri.EscapeDataString(payload.FileName);

            var presignedRequest = new GetPreSignedUrlRequest
            {
                BucketName = BucketName,
                Key = payload.FileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(payload.ExpiresInMinutes),
                ResponseHeaderOverrides = new ResponseHeaderOverrides
                {
                    ContentDisposition = $"attachment; filename*=UTF-8''{encodedFileName}"
                }
            };

			var downloadUrl = _s3Client.GetPreSignedURL(presignedRequest);
			context.Logger.LogInformation($"Download URL generated successfully for userId={payload.UserId}, fileName={payload.FileName}");

			return CreateResponse(200, new { downloadUrl });
		}
		catch (Exception ex)
		{
			context.Logger.LogError(ex.ToString());
			context.Logger.LogError($"GetDownloadUrl failed: {ex}");
			return CreateResponse(500, new { message = "Internal server error." });
		}
	}

	private static ParseResult ParseRequest(APIGatewayHttpApiV2ProxyRequest request)
	{
		if (string.IsNullOrWhiteSpace(request?.Body))
		{
			return ParseResult.Invalid("Request body is required.");
		}

		var rawBody = request.Body;
		if (request.IsBase64Encoded)
		{
			try
			{
				rawBody = Encoding.UTF8.GetString(Convert.FromBase64String(request.Body));
			}
			catch
			{
				return ParseResult.Invalid("Request body is not valid base64.");
			}
		}

		DownloadUrlRequestBody? payload;
		try
		{
			payload = JsonSerializer.Deserialize<DownloadUrlRequestBody>(
				rawBody,
				new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
		}
		catch
		{
			return ParseResult.Invalid("Request body is not valid JSON.");
		}

		var fileName = payload?.FileName?.Trim();
		if (string.IsNullOrWhiteSpace(fileName))
		{
			return ParseResult.Invalid("fileName is required.");
		}

		var userId = string.IsNullOrWhiteSpace(payload?.UserId) ? "guest" : payload!.UserId!.Trim();
		var expiresInMinutes = payload?.ExpiresInMinutes ?? 5;
		if (expiresInMinutes <= 0)
		{
			expiresInMinutes = 5;
		}

		var maxDownloads = payload?.MaxDownloads ?? 1;
		if (maxDownloads <= 0)
		{
			maxDownloads = 1;
		}

		return ParseResult.Valid(new ParsedRequest
		{
			FileName = fileName,
			UserId = userId,
			ExpiresInMinutes = expiresInMinutes,
			MaxDownloads = maxDownloads
		});
	}

	private static string GetStringAttribute(Dictionary<string, AttributeValue> item, params string[] keys)
	{
		foreach (var key in keys)
		{
			if (item.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value?.S))
			{
				return value.S;
			}
		}

		return string.Empty;
	}

	private static APIGatewayHttpApiV2ProxyResponse CreateResponse(int statusCode, object body)
	{
		return new APIGatewayHttpApiV2ProxyResponse
		{
			StatusCode = statusCode,
			Headers = new Dictionary<string, string>(CorsHeaders),
			Body = JsonSerializer.Serialize(body)
		};
	}

	private sealed class DownloadUrlRequestBody
	{
		public string? FileName { get; set; }
		public string? UserId { get; set; }
		public int? ExpiresInMinutes { get; set; }
		public int? MaxDownloads { get; set; }
	}

	private sealed class ParsedRequest
	{
		public string FileName { get; set; } = string.Empty;
		public string UserId { get; set; } = "guest";
		public int ExpiresInMinutes { get; set; } = 5;
		public int MaxDownloads { get; set; } = 1;
	}

	private sealed class ParseResult
	{
		public bool IsValid { get; init; }
		public string ErrorMessage { get; init; } = string.Empty;
		public ParsedRequest? Payload { get; init; }

		public static ParseResult Valid(ParsedRequest payload) => new()
		{
			IsValid = true,
			Payload = payload
		};

		public static ParseResult Invalid(string errorMessage) => new()
		{
			IsValid = false,
			ErrorMessage = errorMessage
		};
	}
}
