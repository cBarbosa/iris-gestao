using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IDadoBancarioService
{
    Task<CommandResult> Insert(CriarDadosBancarioCommand cmd);
}