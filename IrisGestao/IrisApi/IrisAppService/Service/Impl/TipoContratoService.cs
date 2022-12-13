using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TipoContratoService: ITipoContratoService
{
    private readonly ITipoContratoRepository tipoContratoRepository;
    
    public TipoContratoService(ITipoContratoRepository TipoContratoRepository)
    {
        this.tipoContratoRepository = TipoContratoRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var TipoContratos = await Task.FromResult(tipoContratoRepository.GetAll());

        return !TipoContratos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, TipoContratos);
    }
}