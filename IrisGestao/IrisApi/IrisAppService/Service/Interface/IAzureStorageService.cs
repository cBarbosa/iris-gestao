namespace IrisGestao.ApplicationService.Services.Interface;

public interface IAzureStorageService
{
    Task<string> UploadBase64data(byte[] base64Data, string fileName, string destinationFolder, string container);
}