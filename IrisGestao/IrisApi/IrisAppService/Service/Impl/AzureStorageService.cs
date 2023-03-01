using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class AzureStorage: IAzureStorage
{
    private readonly ILogger<AzureStorage> logger;

    public AzureStorage(ILogger<AzureStorage> logger)
    {
        this.logger = logger;
    }
    
    
}