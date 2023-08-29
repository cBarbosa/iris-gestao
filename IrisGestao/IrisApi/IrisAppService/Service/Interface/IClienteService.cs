using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IClienteService
{
    Task<CommandResult> GetAllPaging(int? idTipo, string? nome, int limit, int page);
    Task<CommandResult> GetByGuid(Guid guidReferencia);
    Task<CommandResult> Insert(CriarClienteCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarClienteCommand cmd);
    Task<CommandResult> Delete(int? codigo);
    Task<CommandResult> GetAllOwners();
    Task<CommandResult> AlterarStatus(Guid uuid, bool status);
    Task<CommandResult> GetByCpfCnpj(string cpfCnpj);
}