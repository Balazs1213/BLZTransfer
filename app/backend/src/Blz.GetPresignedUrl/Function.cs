using System;
using System.Collections.Generic;
using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Blz.GetPresignedUrl;

public class Function
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName = "blz-quarantine-bucket-w1srf8"; 

    public Function()
    {
        _s3Client = new AmazonS3Client();
    }

    public UploadResponse FunctionHandler(UploadRequest request, ILambdaContext context)
    {
        try
        {
            if (string.IsNullOrEmpty(request.FileName))
            {
                throw new Exception("FileName is missing from the request.");
            }

            var uniqueFileName = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{request.FileName}";

            var urlRequest = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = uniqueFileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(5) 
            };

            string presignedUrl = _s3Client.GetPreSignedURL(urlRequest);
            
            context.Logger.LogInformation($"Successfully generated pre-signed URL for: {uniqueFileName}");

            return new UploadResponse
            {
                Message = "Success",
                FileName = uniqueFileName,
                UploadUrl = presignedUrl
            };
        }
        catch (Exception ex)
        {
            context.Logger.LogError($"Error: {ex.Message}");
            throw; 
        }
    }
}

public class UploadRequest
{
    public string? FileName { get; set; }
    public long FileSize { get; set; }
}

public class UploadResponse
{
    public string? Message { get; set; }
    public string? FileName { get; set; }
    public string? UploadUrl { get; set; }
}