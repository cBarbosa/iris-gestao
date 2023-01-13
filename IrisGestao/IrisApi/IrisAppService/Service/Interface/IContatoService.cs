using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IContatoService
{
    Task<CommandResult> GetByGuid(Guid guid);
    Task<CommandResult> GetAll();
    Task<CommandResult> GetByGuidCliente(Guid guid);
    Task<CommandResult> Insert(CriarContatoCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarContatoCommand cmd);
    Task<CommandResult> Delete(Guid uuid);
}