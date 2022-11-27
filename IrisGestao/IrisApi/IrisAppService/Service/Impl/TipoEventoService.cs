using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TipoEventoService: ITipoEventoService
{
    private readonly ITipoEventoRepository tipoEventoRepository;
    
    public TipoEventoService(ITipoEventoRepository TipoEventoRepository)
    {
        this.tipoEventoRepository = TipoEventoRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var TipoEventos = await Task.FromResult(tipoEventoRepository.GetAll());

        return !TipoEventos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, TipoEventos);
    }
}