
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContratoAluguelUnidadeRepository : IRepository<ContratoAluguelUnidade>, IDisposable
{
    Task<ContratoAluguelUnidade?> GetById(int id);
    Task<IEnumerable<ContratoAluguelUnidade>> GetAllUnidadesByContratoAluguel(Guid contratoAluguel);
}