using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface ITipoTituloRepository : IRepository<TipoTitulo>, IDisposable
{
    Task<TipoTitulo?> GetById(int id);
}