using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IFaturaTituloPagarRepository : IRepository<FaturaTituloPagar>, IDisposable
{
    Task<FaturaTituloPagar?> GetByReferenceGuid(Guid guid);
    Task<IEnumerable<FaturaTituloPagar>> GetFaturasByTitulo(int idTitulo);
}