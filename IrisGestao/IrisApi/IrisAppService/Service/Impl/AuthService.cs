using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class AuthService: IAuthService 
{
    private readonly ILogger<AuthService> Logger;

    public AuthService(ILogger<AuthService> Logger)
    {
        this.Logger = Logger;
    }
    
    public async Task<CommandResult> GetAuthData(string email, string name, string jobTitle, int expirationTS)
    {
        return await Task.FromResult(new CommandResult(true, "Dados validados com sucesso",
            new
            {
                Id = new Random().Next(1,999),
                Uuid = Guid.NewGuid(),
                Email = email,
                Name = name,
                Perfil = jobTitle,
                RequestUTCDateTime = DateTime.Now.ToLocalTime(),
                Expiration = expirationTS,
                ExpirationUTCDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0)
                    .AddSeconds(expirationTS).ToLocalTime()
            }));
    }

}