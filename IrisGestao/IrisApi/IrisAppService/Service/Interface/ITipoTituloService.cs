using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoTituloService
{
    Task<CommandResult> GetAll();
}