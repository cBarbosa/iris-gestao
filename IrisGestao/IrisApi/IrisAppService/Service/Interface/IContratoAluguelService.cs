using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IContratoAluguelService
{
    //Task<CommandResult> GetAllPaging(int? idTipo, string? nome, int limit, int page);
    Task<CommandResult> GetByGuid(Guid guidReferencia);
    Task<CommandResult> Insert(CriarContratoAluguelCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarContratoAluguelCommand cmd);
    Task<CommandResult> Delete(Guid uuid);
    //Task<CommandResult> AlterarStatus(Guid uuid, bool status);
}