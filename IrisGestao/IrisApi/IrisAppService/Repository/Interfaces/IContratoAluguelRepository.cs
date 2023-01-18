using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContratoAluguelRepository : IRepository<ContratoAluguel>, IDisposable
{
    Task<ContratoAluguel?> GetByGuid(Guid guid);
    Task<object?> GetByContratoAluguelGuid(Guid guid);
}