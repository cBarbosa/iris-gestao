using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IClienteService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> Insert(CriarClienteCommand cmd);
    Task<CommandResult> Update(int? codigo, CriarClienteCommand cmd);

    Task<CommandResult> Delete(int? codigo);
}