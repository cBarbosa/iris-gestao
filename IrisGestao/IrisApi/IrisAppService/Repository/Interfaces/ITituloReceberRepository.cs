using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface ITituloReceberRepository : IRepository<TituloReceber>, IDisposable
{
    Task<int> GetNumeroTitulo();
    Task<CommandPagingResult?> GetAllPaging(string? nomeProprietario, int? idTipoTitulo, int limit, int page);
    Task<TituloReceber?> GetByReferenceGuid(Guid guid);
    Task<TituloReceber?> GetByContratoAluguelId(int idContratoAluguel);
    Task<object?> GetByTituloReceberGuid(Guid guid);
}