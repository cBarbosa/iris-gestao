using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IEventoService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> Insert(CriarEventoCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarEventoCommand cmd);
    Task<CommandResult> Delete(Guid uuid);
    Task<CommandResult> BuscarEventoPorIdImovel(int codigo);
    Task<CommandResult> BuscarEventoPorIdCliente(int codigo);

}