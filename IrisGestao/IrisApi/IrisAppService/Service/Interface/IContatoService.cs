using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IContatoService
{
    Task<CommandResult> GetAll();
}