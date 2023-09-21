using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IObraService
{
    Task<CommandResult> GetAllPaging(int? idCategoria, int? idProprietario, string? nome, int limit, int page);
    Task<CommandResult> GetByReferenceGuid(Guid uuid);
    Task<CommandResult> Insert(CriarObraCommand cmd);
    Task<CommandResult> Update(Guid guid, CriarObraCommand cmd);
    Task<CommandResult> InsertServico(Guid guid, CriarObraServicoCommand cmd);
    Task<CommandResult> UpdateServico(Guid guid, CriarObraServicoCommand cmd);
}