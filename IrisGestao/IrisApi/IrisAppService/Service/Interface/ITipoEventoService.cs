using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoEventoService
{
    Task<CommandResult> GetAll();
}