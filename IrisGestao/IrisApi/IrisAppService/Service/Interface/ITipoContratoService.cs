using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoContratoService
{
    Task<CommandResult> GetAll();
}