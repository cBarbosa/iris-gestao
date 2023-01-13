using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IUnidadeRepository : IRepository<Unidade>, IDisposable
{
    IEnumerable<Unidade> BuscarUnidadePorImovel(int codigo);
    IEnumerable<Unidade> GetById(int codigo);
    IEnumerable<Unidade> GetAll();
    Task<object?> GetByUid(Guid guid);
    Task<Unidade?> GetByReferenceGuid(Guid uid);
}