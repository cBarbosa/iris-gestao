using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IContratoAluguelHistoricorReajusteService
{
    Task<CommandResult> GetByGuid(Guid guid);
    Task<CommandResult> GetByGuidContratoAluguel(Guid guid);
    Task<CommandResult> Insert(ContratoAluguelHistoricoReajusteCommand cmd);
}