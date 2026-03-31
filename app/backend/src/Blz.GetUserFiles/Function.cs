using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.GetUserFiles;

public class Function
{
	private const string TableName = "blz-files-table";
	private readonly IAmazonDynamoDB _dynamoDbClient;

	public Function()
		: this(new AmazonDynamoDBClient())
	{
	}

	public Function(IAmazonDynamoDB dynamoDbClient)
	{
		_dynamoDbClient = dynamoDbClient;
	}

	public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
	{
		try
		{
			var userId = ResolveUserId(request);
			context.Logger.LogInformation($"GetUserFiles started for userId: {userId}");

			var queryRequest = new QueryRequest
			{
				TableName = TableName,
				KeyConditionExpression = "userId = :v_userId",
				ExpressionAttributeValues = new Dictionary<string, AttributeValue>
				{
					[":v_userId"] = new AttributeValue { S = userId }
				}
			};

			var queryResponse = await _dynamoDbClient.QueryAsync(queryRequest);

			var files = new List<FileItemResponse>();
			foreach (var item in queryResponse.Items)
			{
				files.Add(new FileItemResponse
				{
					FileName = GetString(item, "FileName", "fileName"),
					OriginalName = GetString(item, "OriginalName", "originalName"),
					FileSize = GetLong(item, "FileSize", "fileSize"),
					UploadDate = GetString(item, "UploadDate", "uploadDate"),
					Status = GetString(item, "Status", "status"),
					Category = GetString(item, "Category", "category"),
					AiLabels = GetStringList(item, "AiLabels", "aiLabels"),
					ExtractedText = GetString(item, "ExtractedText", "extractedText")
				});
			}

			context.Logger.LogInformation($"GetUserFiles finished for userId: {userId}, item count: {files.Count}");

			return new APIGatewayHttpApiV2ProxyResponse
			{
				StatusCode = 200,
				Body = JsonSerializer.Serialize(files),
				Headers = new Dictionary<string, string>
				{
					["Content-Type"] = "application/json",
                    ["Access-Control-Allow-Origin"] = "*",
                    ["Access-Control-Allow-Headers"] = "*",
                    ["Access-Control-Allow-Methods"] = "*"
				}
			};
		}
		catch (Exception ex)
		{
			context.Logger.LogError($"GetUserFiles failed: {ex}");

			var errorBody = JsonSerializer.Serialize(new { message = "Internal server error." });
			return new APIGatewayHttpApiV2ProxyResponse
			{
				StatusCode = 500,
				Body = errorBody,
				Headers = new Dictionary<string, string>
				{
					["Content-Type"] = "application/json",
                    ["Access-Control-Allow-Origin"] = "*",
                    ["Access-Control-Allow-Headers"] = "*",
                    ["Access-Control-Allow-Methods"] = "*"
				}
			};
		}
	}

	private static string ResolveUserId(APIGatewayHttpApiV2ProxyRequest? request)
	{
		if (request?.QueryStringParameters != null &&
			request.QueryStringParameters.TryGetValue("userId", out var queryUserId) &&
			!string.IsNullOrWhiteSpace(queryUserId))
		{
			return queryUserId;
		}

		if (!string.IsNullOrWhiteSpace(request?.Body))
		{
			try
			{
				using var document = JsonDocument.Parse(request.Body);
				if (document.RootElement.TryGetProperty("userId", out var userIdElement) &&
					userIdElement.ValueKind == JsonValueKind.String)
				{
					var bodyUserId = userIdElement.GetString();
					if (!string.IsNullOrWhiteSpace(bodyUserId))
					{
						return bodyUserId;
					}
				}
			}
			catch
			{
				// Intentionally ignored: invalid body format falls back to guest.
			}
		}

		return "guest";
	}

	private static string GetString(Dictionary<string, AttributeValue> item, params string[] keys)
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

	private static long GetLong(Dictionary<string, AttributeValue> item, params string[] keys)
	{
		foreach (var key in keys)
		{
			if (!item.TryGetValue(key, out var value) || value == null)
			{
				continue;
			}

			if (!string.IsNullOrWhiteSpace(value.N) && long.TryParse(value.N, out var numericValue))
			{
				return numericValue;
			}

			if (!string.IsNullOrWhiteSpace(value.S) && long.TryParse(value.S, out var stringValue))
			{
				return stringValue;
			}
		}

		return 0;
	}

	private static List<string> GetStringList(Dictionary<string, AttributeValue> item, params string[] keys)
	{
		foreach (var key in keys)
		{
			if (!item.TryGetValue(key, out var value) || value == null)
			{
				continue;
			}

			if (value.SS != null && value.SS.Count > 0)
			{
				return new List<string>(value.SS);
			}

			if (value.L != null && value.L.Count > 0)
			{
				var labels = new List<string>();
				foreach (var listItem in value.L)
				{
					if (!string.IsNullOrWhiteSpace(listItem?.S))
					{
						labels.Add(listItem.S);
					}
				}

				return labels;
			}
		}

		return new List<string>();
	}
}

public class FileItemResponse
{
	public string FileName { get; set; } = string.Empty;
	public string OriginalName { get; set; } = string.Empty;
	public long FileSize { get; set; }
	public string UploadDate { get; set; } = string.Empty;
	public string Status { get; set; } = string.Empty;
	public string Category { get; set; } = string.Empty;
	public List<string> AiLabels { get; set; } = new();
	public string ExtractedText { get; set; } = string.Empty;
}
