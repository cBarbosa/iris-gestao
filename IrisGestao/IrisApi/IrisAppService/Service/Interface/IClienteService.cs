using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IClienteService
{
    Task<CommandResult> GetAllPaging(int limit, int page);
    Task<CommandResult> GetByGuid(Guid guidReferencia);
    Task<CommandResult> Insert(CriarClienteCommand cmd);
    Task<CommandResult> Update(int? codigo, CriarClienteCommand cmd);

    Task<CommandResult> Delete(int? codigo);
}