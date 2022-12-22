using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoClienteService
{
    Task<CommandResult> GetAll();
}