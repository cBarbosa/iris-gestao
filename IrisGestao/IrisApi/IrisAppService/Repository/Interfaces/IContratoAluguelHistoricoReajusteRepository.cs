using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContratoAluguelHistoricoReajusteRepository : IRepository<ContratoAluguelHistoricoReajuste>, IDisposable
{
    Task<ContratoAluguelHistoricoReajuste?> GetByGuid(Guid guid);
    Task<object?> GetByGuidContratoAluguel(Guid guid);
}