using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

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
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", TipoContratos);
    }
}