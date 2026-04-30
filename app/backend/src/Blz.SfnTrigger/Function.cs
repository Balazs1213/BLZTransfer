using System;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.Lambda.S3Events;
using Amazon.StepFunctions;
using Amazon.StepFunctions.Model;

// Szöveges JSON szerializáló beállítása a Lambda számára
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.SfnTrigger
{
    public class Function
    {
        private readonly IAmazonStepFunctions _sfnClient;
        // A saját State Machine ARN-ed
        private const string StateMachineArn = "arn:aws:states:us-east-1:056369651569:stateMachine:blz-file-processor";

        public Function()
        {
            // Inicializáljuk a Step Functions klienst
            _sfnClient = new AmazonStepFunctionsClient();
        }

        public async Task<string> FunctionHandler(S3Event evnt, ILambdaContext context)
        {
            try
            {
                var record = evnt.Records[0];
                var bucketName = record.S3.Bucket.Name;
                var rawKey = record.S3.Object.Key;
                
                // Fájlnév dekódolása (szóközök és speciális karakterek kezelése)
                var fileName = Uri.UnescapeDataString(rawKey.Replace("+", " "));

                context.Logger.LogInformation($"[TRIGGER] New file landed: {bucketName}/{fileName}");

                // Input payload összeállítása a Step Function számára
                var inputPayload = new
                {
                    bucket = bucketName,
                    key = fileName
                };

                // Név generálása a futtatásnak (és a 80 karakteres limit kezelése)
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
                var cleanFileName = Regex.Replace(fileName, "[^a-zA-Z0-9-_]", "");

                // JAVÍTÁS: A Step Function név max 80 karakter lehet.
                // A "Process-" (8), kötőjelek (2), és a timestamp (~13) összesen kb 23 karakter.
                // A maradék (57) miatt a fájlnevet 50 karakterre vágjuk, hogy 100%-ig biztonságos legyen.
                if (cleanFileName.Length > 50)
                {
                    cleanFileName = cleanFileName.Substring(0, 50);
                }

                var executionName = $"Process-{cleanFileName}-{timestamp}";

                // Step Function indítási parancs összeállítása
                var request = new StartExecutionRequest
                {
                    StateMachineArn = StateMachineArn,
                    Input = JsonSerializer.Serialize(inputPayload),
                    Name = executionName
                };

                var response = await _sfnClient.StartExecutionAsync(request);
                context.Logger.LogInformation($"Step Function successfully started! Execution ARN: {response.ExecutionArn}");

                return "Successfully started!";
            }
            catch (Exception ex)
            {
                context.Logger.LogError($"Error starting the Step Function: {ex.Message}");
                throw; 
            }
        }
    }
}