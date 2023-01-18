using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IFornecedorService
{
    Task<CommandResult> GetAllPaging(string? nome, int limit, int page);
    Task<CommandResult> GetByGuid(Guid guidReferencia);
    Task<CommandResult> Insert(CriarFornecedorCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarFornecedorCommand cmd);
    Task<CommandResult> Delete(int? codigo);
    Task<CommandResult> AlterarStatus(Guid uuid, bool status);
}