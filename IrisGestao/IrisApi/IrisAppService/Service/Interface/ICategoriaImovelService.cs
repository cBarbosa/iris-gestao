using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ICategoriaImovelService
{
    Task<CommandResult> GetAll();
}