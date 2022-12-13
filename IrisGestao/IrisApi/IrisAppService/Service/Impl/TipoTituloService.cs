using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TipoTituloService: ITipoTituloService
{
    private readonly ITipoTituloRepository tipoTituloRepository;
    
    public TipoTituloService(ITipoTituloRepository TipoTituloRepository)
    {
        this.tipoTituloRepository = TipoTituloRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var TipoTitulos = await Task.FromResult(tipoTituloRepository.GetAll());

        return !TipoTitulos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, TipoTitulos);
    }
}