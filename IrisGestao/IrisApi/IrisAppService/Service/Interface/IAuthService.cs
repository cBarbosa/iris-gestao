using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IAuthService
{
    Task<CommandResult> GetAuthData(string email, string name, string jobTitle, int expirationTS);
}