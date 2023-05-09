using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IContratoFornecedorService
{
    Task<CommandResult> GetByGuid(Guid guidReferencia);
    Task<CommandResult> Insert(CriarContratoFornecedorCommand cmd);
    Task<CommandResult> AlterarStatus(Guid uuid, bool status);
    Task<CommandResult> GetAllPaging(string? numeroContrato, int limit, int page);
}