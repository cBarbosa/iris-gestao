using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IFornecedorRepository : IRepository<Fornecedor>, IDisposable
{
    Task<object?> GetByGuid(Guid guid);
    Task<Fornecedor?> GetByReferenceGuid(Guid guid);
    Task <CommandPagingResult?> GetAllPaging(string? nome, int limit, int page);  
}