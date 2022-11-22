using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IAnexoService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetByIdReferencia(Guid idReferencia);
}