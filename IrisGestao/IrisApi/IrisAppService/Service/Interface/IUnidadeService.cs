using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IUnidadeService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> Insert(Guid guidImovel, CriarUnidadeCommand cmd);
    Task<CommandResult> Update(Guid guid, CriarUnidadeCommand cmd);
    Task<CommandResult> Delete(int? codigo);
    Task<CommandResult> BuscarBuscarUnidadePorImovel(int codigoImovel);
    Task<CommandResult> GetByUid(Guid guid);
}