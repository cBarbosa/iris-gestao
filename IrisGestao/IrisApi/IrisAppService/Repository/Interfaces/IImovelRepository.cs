using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IImovelRepository : IRepository<Imovel>, IDisposable
{
    Task <IEnumerable<Imovel>> GetById(int codigo);
    Task <CommandPagingResult?> GetAllPaging(int? idCategoria, int? idProprietario, string? nome, int limit, int page);
    Task<object?> GetByGuid(Guid guid);
    Task<Imovel?> GetByReferenceGuid(Guid guid);
}