using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IAnexoService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> GetByIdReferencia(string idReferencia);
    Task<CommandResult> Insert(CriarAnexoCommand cmd);
    Task<CommandResult> Update(int? codigo, CriarAnexoCommand cmd);
    Task<CommandResult> Delete(int? codigo);
    
}