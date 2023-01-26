using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoCreditoAluguel
{
    Task<CommandResult> GetAll();
}