using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IEventoRepository : IRepository<Evento>, IDisposable
{
    IEnumerable<Evento> GetById(int codigo);
    Task<Evento?> GetByReferenceGuid(Guid guid);
    IEnumerable<Evento> GetAll();
    IEnumerable<Evento> BuscarEventoPorIdImovel(int codigo);
    IEnumerable<Evento> BuscarEventoPorIdCliente(int codigo);
}