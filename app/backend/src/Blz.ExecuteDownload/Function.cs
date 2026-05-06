using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.ExecuteDownload;

public class Function
{
	private const string TableName = "blz-files-table";
	private const string BucketName = "blz-clean-bucket-w1srf8";

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
			if (request == null)
			{
				context?.Logger?.LogError("ExecuteDownload received a null request.");
				return CreateResponse(400, new { message = "Invalid request." });
			}

			if (string.Equals(request.RequestContext?.Http?.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase))
			{
				return CreateResponse(200, new { message = "OK" });
			}

			var userId = GetQueryValue(request, "userId");
			var fileName = GetQueryValue(request, "fileName");

			if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(fileName))
			{
				return CreateResponse(400, new { message = "userId and fileName are required." });
			}

			context.Logger.LogInformation($"ExecuteDownload started for userId={userId}, fileName={fileName}");

			var nowUnix = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

			try
			{
				await _dynamoDbClient.UpdateItemAsync(new UpdateItemRequest
				{
					TableName = TableName,
					Key = new Dictionary<string, AttributeValue>
					{
						["userId"] = new AttributeValue { S = userId },
						["fileName"] = new AttributeValue { S = fileName }
					},
					UpdateExpression = "SET remainingDownloads = remainingDownloads - :one",
					ConditionExpression = "attribute_exists(fileName) AND remainingDownloads >= :one AND shareExpiresAt > :now",
					ExpressionAttributeValues = new Dictionary<string, AttributeValue>
					{
						[":one"] = new AttributeValue { N = "1" },
						[":now"] = new AttributeValue { N = nowUnix.ToString() }
					}
				});
			}
			catch (ConditionalCheckFailedException)
			{
				context.Logger.LogInformation($"Download denied for userId={userId}, fileName={fileName}: quota reached or link expired.");
				return CreateResponse(403, new { message = "Download limit reached or link expired" });
			}

			var presignedUrl = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
			{
				BucketName = BucketName,
				Key = fileName,
				Verb = HttpVerb.GET,
				Expires = DateTime.UtcNow.AddSeconds(15),
				ResponseHeaderOverrides = new ResponseHeaderOverrides
				{
					ContentDisposition = $"attachment; filename=\"{fileName}\""
				}
			});

			context.Logger.LogInformation($"ExecuteDownload redirect generated for userId={userId}, fileName={fileName}");

			var redirectHeaders = CreateCorsHeaders();
			redirectHeaders["Location"] = presignedUrl;

			return new APIGatewayHttpApiV2ProxyResponse
			{
				StatusCode = 302,
				Headers = redirectHeaders
			};
		}
		catch (Exception ex)
		{
			context.Logger.LogError($"ExecuteDownload failed: {ex}");
			return CreateResponse(500, new { message = "Internal server error." });
		}
	}

	private static string GetQueryValue(APIGatewayHttpApiV2ProxyRequest request, string key)
	{
		if (request?.QueryStringParameters != null &&
			request.QueryStringParameters.TryGetValue(key, out var value) &&
			!string.IsNullOrWhiteSpace(value))
		{
			return value;
		}

		return string.Empty;
	}

	private static APIGatewayHttpApiV2ProxyResponse CreateResponse(int statusCode, object body)
	{
		return new APIGatewayHttpApiV2ProxyResponse
		{
			StatusCode = statusCode,
			Headers = CreateCorsHeaders(),
			Body = JsonSerializer.Serialize(body)
		};
	}

	private static Dictionary<string, string> CreateCorsHeaders()
	{
		return new Dictionary<string, string>
		{
			["Access-Control-Allow-Origin"] = "*",
			["Access-Control-Allow-Headers"] = "*",
			["Access-Control-Allow-Methods"] = "*",
			["Content-Type"] = "application/json"
		};
	}
}
