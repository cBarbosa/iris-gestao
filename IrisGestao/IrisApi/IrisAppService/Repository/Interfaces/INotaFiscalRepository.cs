using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface INotaFiscalRepository: IRepository<NotaFiscal>, IDisposable
{
    Task<object?> GetByReferenceGuid(Guid uuid);
    Task<NotaFiscal?> GetByGuid(Guid uuid);
}