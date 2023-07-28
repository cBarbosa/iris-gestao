
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface ITituloUnidadeRepository : IRepository<TituloUnidade>, IDisposable
{
    IEnumerable<TituloUnidade> BuscarTituloUnidadeByImovelId(Guid uuid);
}