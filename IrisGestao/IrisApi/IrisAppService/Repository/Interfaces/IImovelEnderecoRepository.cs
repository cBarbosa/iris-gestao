using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IImovelEnderecoRepository : IRepository<ImovelEndereco>, IDisposable
{
    IEnumerable<ImovelEndereco> GetById(int codigo);
    IEnumerable<ImovelEndereco> BuscarEnderecoPorImovel(int codigo);
    Task<ImovelEndereco?> GetByImovelReferenceGuid(Guid uuid);
}