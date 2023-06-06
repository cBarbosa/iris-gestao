using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IContratoAluguelService
{
    Task<CommandResult> GetByGuid(Guid guidReferencia);
    Task<CommandResult> Insert(CriarContratoAluguelCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarContratoAluguelCommand cmd);
    Task<CommandResult> AlterarStatus(Guid uuid, bool status);
    Task<CommandResult> ReajusteContrato(Guid uuid, double novoPercentualReajuste);
    Task<CommandResult> GetAllPaging(int? idTipoImovel, int? idBaseReajuste, DateTime? dthInicioVigencia, DateTime? dthFimVigencia, string? numeroContrato, int limit, int page);
    Task<CommandResult> GetDashbaordFinancialVacancy(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador, int? IdTipoImovel);
    Task<CommandResult> GetDashbaordPhysicalVacancy(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador, int? IdTipoImovel);
    
    Task<CommandResult> GetDashboardTotalManagedArea(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador, int? IdTipoImovel);
}