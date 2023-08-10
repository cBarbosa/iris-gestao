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
    Task<CommandResult> GetDashbaordFinancialVacancy(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador, int? IdTipoImovel, int? IdArea);
    Task<CommandResult> GetDashbaordPhysicalVacancy(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador, int? IdTipoImovel);
    Task<CommandResult> GetDashbaordReceivingPerformance(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel);
    Task<CommandResult> GetDashbaordAreaPrice(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel);
    Task<CommandResult> GetDashboardTotalManagedArea(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador, int? IdTipoImovel);
    Task<CommandResult> GetAllActiveOwners();
    Task<CommandResult> GetAllActiveProperties();
    Task<CommandResult> GetUnidadesByContrato(Guid guid);
    Task<CommandResult> GetReportLeasedArea(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetReportRentValue(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario, DateTime? dateRef);
    Task<CommandResult> GetReportExpenses(DateTime dateInit, DateTime dateEnd, bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetReportRevenues(DateTime dateInit, DateTime dateEnd, bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetReportSupplyContract(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetAllActivePropertTypes();
}