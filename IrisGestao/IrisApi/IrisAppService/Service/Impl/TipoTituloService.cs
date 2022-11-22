using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

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
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", TipoTitulos);
    }
}