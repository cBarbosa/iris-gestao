using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IImovelService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> Insert(CriarImovelCommand cmd);
    Task<CommandResult> Update(int? codigo, CriarImovelCommand cmd);

    Task<CommandResult> Delete(int? codigo);
}