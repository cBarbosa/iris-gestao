using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface ITituloPagarRepository : IRepository<TituloPagar>, IDisposable
{
    Task<int> GetNumeroTitulo();
    Task<CommandPagingResult?> GetAllPaging(string? nomeProprietario, int? idTipoTitulo, int limit, int page);
    Task<TituloPagar?> GetByReferenceGuid(Guid guid);
    Task<TituloPagar?> GetByContratoAluguelId(int idContratoAluguel);
    Task<object?> GetByTituloPagarGuid(Guid guid);
    Task<IEnumerable<object>?> GetAllImoveisTitulo();
}