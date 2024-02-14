using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IEventoRepository : IRepository<Evento>, IDisposable
{
    IEnumerable<Evento> GetById(int codigo);
    Task<object?> GetByGuid(Guid guid);
    Task<Evento?> GetByReferenceGuid(Guid guid);
    IEnumerable<Evento> GetAll();
    IEnumerable<Evento> BuscarEventoPorIdImovel(int codigo);
    IEnumerable<Evento> BuscarEventoPorIdCliente(int codigo);
    Task<CommandPagingResult?> GetAllPaging(int limit, int page);
    Task<IEnumerable<dynamic>?> GetAllProperties();
    Task<IEnumerable<dynamic>?> GetAllRenters();
}