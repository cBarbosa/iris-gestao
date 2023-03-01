using Azure.Storage.Blobs;
using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace IrisGestao.ApplicationService.Service.Impl;

public class AzureStorageService: IAzureStorageService
{
    private readonly ILogger<AzureStorageService> logger;
    private readonly string blobAzureStorageConnectionString;
    private readonly BlobServiceClient blobServiceClient;

    public AzureStorageService(
        IConfiguration configuration,
        ILogger<AzureStorageService> logger)
    {
        this.logger = logger;
        blobAzureStorageConnectionString = configuration["ConnectionStrings:BlobAzureStorage"];
        blobServiceClient = new BlobServiceClient(blobAzureStorageConnectionString);
    }
    
    public async Task<string> UploadBase64data(
        byte[] base64Data,
        string fileName,
        string destinationFolder,
        string container)
    {
        try
        {
            var blobClient = new BlobClient(
                blobAzureStorageConnectionString
                , container
                , $"{destinationFolder}/{fileName}");

            using (var stream = new MemoryStream(base64Data))
            {
                await blobClient.UploadAsync(stream);
            }

            return blobClient.Uri.AbsoluteUri;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            return string.Empty;
        }
    }
}