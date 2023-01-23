using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoCreditoAluguelService
{
    Task<CommandResult> GetAll();
}