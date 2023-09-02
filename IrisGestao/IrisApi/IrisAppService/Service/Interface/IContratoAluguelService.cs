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
    Task<CommandResult> GetDashbaordFinancialVacancy(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador, int? IdArea);
    Task<CommandResult> GetDashbaordPhysicalVacancy(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador);
    Task<CommandResult> GetDashbaordReceivingPerformance(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador);
    Task<CommandResult> GetDashbaordAreaPrice(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idImovel);
    Task<CommandResult> GetDashboardTotalManagedArea(DateTime DateRefInit, DateTime DateRefEnd, int? IdLocador);
    Task<CommandResult> GetAllActiveOwners();
    Task<CommandResult> GetAllActiveProperties();
    Task<CommandResult> GetUnidadesByContrato(Guid guid);
    Task<CommandResult> GetReportLeasedArea(int? idImovel, int? idLocatario);
    Task<CommandResult> GetReportRentValue(int? idImovel, int? idLocador, int? idLocatario, DateTime? dateRef);
    Task<CommandResult> GetReportExpenses(DateTime dateInit, DateTime dateEnd, int? idImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetReportRevenues(DateTime dateInit, DateTime dateEnd, int? idImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetReportSupplyContract(int? idImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetAllActivePropertTypes();
    Task<CommandResult> GetActiveRenters();
    Task<CommandResult> GetReportDimob(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idLocatario);
    Task<CommandResult> GetReportCommercial(DateTime dateRefInit, DateTime dateRefEnd, int? idImovel, int? idLocador, int? idLocatario);
    Task<CommandResult> GetReportRentContract(int? idImovel, int? idLocador);
}