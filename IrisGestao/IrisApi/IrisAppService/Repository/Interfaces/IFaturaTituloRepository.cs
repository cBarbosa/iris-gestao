using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IFaturaTituloRepository : IRepository<FaturaTitulo>, IDisposable
{
    Task<FaturaTitulo?> GetByReferenceGuid(Guid guid);
}