using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IFaturaTituloPagarService
{
    Task<CommandResult> Insert(Guid uuid, FaturaTituloPagarCommand cmd);
    Task<CommandResult> Update(Guid uuid, FaturaTituloPagarCommand cmd);
    Task<CommandResult> BaixarFatura(Guid uuid, BaixarFaturaTituloPagarCommand cmd);
}