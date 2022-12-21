using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IClienteRepository : IRepository<Cliente>, IDisposable
{
    Task <CommandPagingResult?> GetAllPaging(int limit, int page);
}