using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IEventoService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetAllPaging(int limit, int page);
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> GetByGuid(Guid uuid);
    Task<CommandResult> Insert(CriarEventoCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarEventoCommand cmd);
    Task<CommandResult> Delete(Guid uuid);
    Task<CommandResult> BuscarEventoPorIdImovel(int codigo);
    Task<CommandResult> BuscarEventoPorIdCliente(int codigo);
    Task<CommandResult> GetAllProperties();
    Task<CommandResult> GetAllRenters();
}