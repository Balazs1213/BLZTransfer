using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.CheckFileStatus;

public class Function
{
    private readonly IAmazonDynamoDB _dynamoDbClient;
    private readonly string _tableName = "blz-files-table";

    public Function()
    {
        _dynamoDbClient = new AmazonDynamoDBClient();
    }

   
    public async Task<StatusResponse> FunctionHandler(JsonElement requestEvent, ILambdaContext context)
    {
        try
        {
           
            if (!requestEvent.TryGetProperty("body", out var bodyElement) || string.IsNullOrEmpty(bodyElement.GetString()))
            {
                throw new Exception("Body is missing from the Lambda URL event.");
            }

     
            string bodyString = bodyElement.GetString()!;
            var request = JsonSerializer.Deserialize<StatusRequest>(bodyString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (request == null || string.IsNullOrEmpty(request.FileName))
            {
                throw new Exception("FileName is missing from the parsed body.");
            }

            var userId = string.IsNullOrEmpty(request.UserId) ? "guest" : request.UserId;

            
            var requestDb = new GetItemRequest
            {
                TableName = _tableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "userId", new AttributeValue { S = userId } },
                    { "fileName", new AttributeValue { S = request.FileName } }
                }
            };

            var response = await _dynamoDbClient.GetItemAsync(requestDb);

            if (response.Item == null || response.Item.Count == 0)
            {
                return new StatusResponse { Status = "NotFound" };
            }

            return new StatusResponse { Status = response.Item["status"].S };
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Error: {ex.Message}");
            throw; 
        }
    }
}

public class StatusRequest
{
    public string? UserId { get; set; }
    public string? FileName { get; set; }
}

public class StatusResponse
{
    
    [JsonPropertyName("status")]
    public string? Status { get; set; }
}