using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContatoRepository: IRepository<Contato>, IDisposable
{
    Task<Contato?> GetByGuid(Guid guid);
    Task<object?> GetByClienteId(int id);
    Task<object?> GetByFornecedorId(int fornecedorId);
}