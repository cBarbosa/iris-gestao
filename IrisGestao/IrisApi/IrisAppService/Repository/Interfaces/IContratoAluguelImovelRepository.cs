using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContratoAluguelImovelRepository : IRepository<ContratoAluguelImovel>, IDisposable
{
    Task<IEnumerable<ContratoAluguelImovel>> GetContratoImoveisByContrato(int idContratoAluguel);
}