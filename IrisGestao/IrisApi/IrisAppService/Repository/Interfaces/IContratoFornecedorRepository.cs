using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IContratoFornecedorRepository : IRepository<ContratoFornecedor>, IDisposable
{
    //Task<ContratoFornecedor?> GetByGuid(Guid guid);
    Task<object?> GetByContratoFornecedorGuid(Guid guid);
    Task<CommandPagingResult?> GetAllPaging(string? numeroContrato, int limit, int page);
}