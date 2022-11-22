using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IFormaPagamentoService
{
    Task<CommandResult> GetAll();
}