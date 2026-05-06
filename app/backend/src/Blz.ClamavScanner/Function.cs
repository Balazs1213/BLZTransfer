using System;
using System.Linq;
using Amazon.Lambda.Core;

// JSON szerializáció engedélyezése a paraméterekhez
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.ClamavScanner;

public class Function
{
    // A tiltott kiterjesztések listája
    private static readonly string[] ForbiddenExtensions = { ".exe", ".bat", ".cmd", ".sh", ".vbs" };

    public ScannerResponse FunctionHandler(ScannerEvent input, ILambdaContext context)
    {
        context.Logger.LogInformation("[CLAMAV-SCANNER] Starting mock file scan...");
        context.Logger.LogInformation($"[CLAMAV-SCANNER] Received event for bucket: {input.Bucket}, key: {input.Key}");

        if (string.IsNullOrWhiteSpace(input.Key))
        {
            throw new Exception("Missing file name (key) in the event payload!");
        }

        string lowerCaseFileName = input.Key.ToLower();
        
        bool isDangerous = ForbiddenExtensions.Any(ext => lowerCaseFileName.EndsWith(ext));

        string scanResult = isDangerous ? "INFECTED" : "CLEAN";

        context.Logger.LogInformation($"[CLAMAV-SCANNER] File: {input.Key} | Scan Result: {scanResult}");

        return new ScannerResponse
        {
            Bucket = input.Bucket,
            Key = input.Key,
            Status = scanResult
        };
    }
}

// Bemeneti adatszerkezet (amit a Step Functions vagy S3 küld)
public class ScannerEvent
{
    public string? Bucket { get; set; }
    public string? Key { get; set; }
}

// Kimeneti adatszerkezet (amit visszaadunk a Step Functions-nek)
public class ScannerResponse
{
    public string? Bucket { get; set; }
    public string? Key { get; set; }
    public string? Status { get; set; }
}