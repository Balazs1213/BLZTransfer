using System.Text.Json;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.DeleteFile;

public class Function
{
	private const string BucketName = "blz-clean-bucket-w1srf8";
	private const string TableName = "blz-files-table";

	private static readonly Dictionary<string, string> CorsHeaders = new()
	{
		["Access-Control-Allow-Origin"] = "*",
		["Access-Control-Allow-Headers"] = "*",
		["Access-Control-Allow-Methods"] = "*"
	};

	private readonly IAmazonS3 _s3Client;
	private readonly IAmazonDynamoDB _dynamoDbClient;

	public Function()
	{
		_s3Client = new AmazonS3Client();
		_dynamoDbClient = new AmazonDynamoDBClient();
	}

	public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(
		APIGatewayHttpApiV2ProxyRequest request,
		ILambdaContext context)
	{
		if (request.RequestContext?.Http?.Method == "OPTIONS")
		{
			return new APIGatewayHttpApiV2ProxyResponse
			{
				StatusCode = 200,
				Headers = CorsHeaders,
				Body = string.Empty
			};
		}

		try
		{
			string bodyString = request.IsBase64Encoded
				? System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(request.Body ?? string.Empty))
				: request.Body ?? string.Empty;

			var payload = JsonSerializer.Deserialize<DeleteFileRequest>(
				bodyString,
				new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

			if (string.IsNullOrWhiteSpace(payload?.UserId) || string.IsNullOrWhiteSpace(payload.FileName))
			{
				throw new InvalidOperationException("Request body must include userId and fileName.");
			}

			try
			{
				await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
				{
					BucketName = BucketName,
					Key = payload.FileName
				});
			}
			catch (AmazonS3Exception s3Ex)
			{
				context.Logger.LogError($"S3 delete failed for key '{payload.FileName}': {s3Ex.Message}");
			}

			await _dynamoDbClient.DeleteItemAsync(new DeleteItemRequest
			{
				TableName = TableName,
				Key = new Dictionary<string, AttributeValue>
				{
					["userId"] = new AttributeValue { S = payload.UserId },
					["fileName"] = new AttributeValue { S = payload.FileName }
				}
			});

			return new APIGatewayHttpApiV2ProxyResponse
			{
				StatusCode = 200,
				Headers = CorsHeaders,
				Body = "{\"message\":\"File deleted successfully\"}"
			};
		}
		catch (Exception ex)
		{
			context.Logger.LogError($"Unexpected error deleting file: {ex}");

			return new APIGatewayHttpApiV2ProxyResponse
			{
				StatusCode = 500,
				Headers = CorsHeaders,
				Body = "{\"message\":\"Internal server error\"}"
			};
		}
	}

	private sealed class DeleteFileRequest
	{
		public string? UserId { get; set; }
		public string? FileName { get; set; }
	}
}
