using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContratoAluguelRepository : IRepository<ContratoAluguel>, IDisposable
{
    Task<ContratoAluguel?> GetByGuid(Guid guid);
    Task<object?> GetByContratoAluguelGuid(Guid guid);
    Task<CommandPagingResult?> GetAllPaging(int? idTipoImovel, int? idBaseReajuste, DateTime? dthInicioVigencia, DateTime? dthFimVigencia, string? numeroContrato, int limit, int page);
}