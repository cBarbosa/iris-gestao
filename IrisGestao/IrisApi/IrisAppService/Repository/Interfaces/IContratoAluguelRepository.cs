using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using IrisGestao.Domain.Procs;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContratoAluguelRepository : IRepository<ContratoAluguel>, IDisposable
{
    Task<ContratoAluguel?> GetByGuid(Guid guid);
    Task<object?> GetByContratoAluguelGuid(Guid guid);
    Task<CommandPagingResult?> GetAllPaging(int? idTipoImovel, int? idBaseReajuste, DateTime? dthInicioVigencia, DateTime? dthFimVigencia, string? numeroContrato, int limit, int page);
    Task<IEnumerable<SpFinancialVacancyResult>?> GetDashbaordFinancialVacancy(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel, int? idTipoArea);
    Task<IEnumerable<SpReceivingPerformanceResult>> GetDashbaordReceivingPerformance(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel);
    Task<IEnumerable<SpAreaPriceResult>> GetDashbaordAreaPrice(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel);
    Task<IEnumerable<SpPhysicalVacancyResult>?> GetDashbaordPhysicalVacancy(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel);
    Task<object> GetDashboardTotalManagedArea(int? idLocador, int? idTipoImovel);
    Task<IEnumerable<Object>?> GetImoveisUnidadesContratoAluguelAtivos();
    Task<IEnumerable<dynamic>> GetAllActiveProperties();
    Task<IEnumerable<dynamic>> GetAllActiveOwners();
    Task<object?> GetUnidadesByContratoAluguel(Guid guid);
    Task<IEnumerable<SpLeasedAreaResult>?> GetReportLeasedArea(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
    Task<IEnumerable<SpRentValueResult>?> GetReportRentValue(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario, DateTime? dateRef);
    Task<IEnumerable<SpExpensesResult>?> GetReportExpenses(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
    Task<IEnumerable<SpRevenuesResult>?> GetReportRevenues(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
    Task<IEnumerable<SpSupplyContractsResult>?> GetReportSupplyContract(bool? status, int? idImovel, int? idTipoImovel, int? idLocador, int? idLocatario);
}