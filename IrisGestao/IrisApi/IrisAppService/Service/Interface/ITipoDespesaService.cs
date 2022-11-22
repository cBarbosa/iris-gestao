using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITipoDespesaService
{
    Task<CommandResult> GetAll();
}