using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IFaturaTituloService
{
    Task<CommandResult> Update(Guid uuid, BaixaDeFaturaCommand cmd);
    Task<CommandResult> BaixarFatura(Guid uuid, BaixaDeFaturaCommand cmd);
}