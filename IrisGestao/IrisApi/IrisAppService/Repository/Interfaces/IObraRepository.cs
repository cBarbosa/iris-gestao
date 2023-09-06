using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IObraRepository: IRepository<Obra>, IDisposable
{
    Task <CommandPagingResult?> GetAllPaging(int? idCategoria, int? idProprietario, string? nome, int limit, int page);
    Task<Obra?> GetByGuid(Guid uuid);
    Task<object?> GetByReferenceGuid(Guid uuid);
    Task<int?> InsertObraUnidade(ObraUnidade obraUnidade);
}