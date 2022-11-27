using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TipoUnidadeService: ITipoUnidadeService
{
    private readonly ITipoUnidadeRepository tipoUnidadeRepository;
    
    public TipoUnidadeService(ITipoUnidadeRepository TipoUnidadeRepository)
    {
        this.tipoUnidadeRepository = TipoUnidadeRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var TipoUnidades = await Task.FromResult(tipoUnidadeRepository.GetAll());

        return !TipoUnidades.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, TipoUnidades);
    }
}