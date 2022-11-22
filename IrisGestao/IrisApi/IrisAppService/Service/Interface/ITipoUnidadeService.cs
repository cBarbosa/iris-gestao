using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoUnidadeService
{
    Task<CommandResult> GetAll();
}