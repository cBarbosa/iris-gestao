using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IIndiceReajusteService
{
    Task<CommandResult> GetAll();
}