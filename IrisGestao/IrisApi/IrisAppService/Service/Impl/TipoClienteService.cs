using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TipoClienteService : ITipoClienteService
{
    private readonly ITipoClienteRepository tipoClienteRepository;
    
    public TipoClienteService(ITipoClienteRepository TipoClienteRepository)
    {
        this.tipoClienteRepository = TipoClienteRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var TipoClientes = await Task.FromResult(tipoClienteRepository.GetAll());

        return !TipoClientes.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, TipoClientes);
    }
}