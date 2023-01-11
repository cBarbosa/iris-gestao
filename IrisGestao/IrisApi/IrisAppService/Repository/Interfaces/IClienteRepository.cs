using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IClienteRepository : IRepository<Cliente>, IDisposable
{
    Task<object?> GetByGuid(Guid guid);
    Task<Cliente?> GetByReferenceGuid(Guid guid);
    Task <CommandPagingResult?> GetAllPaging(int? idTipo, string? nome, int limit, int page);
    Task<IEnumerable<object>?> GetAllOwners();
    Task<Cliente?> GetByCpfCnpj(string cpfCnpj);
}