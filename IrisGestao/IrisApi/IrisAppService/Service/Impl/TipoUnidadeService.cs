using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

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
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", TipoUnidades);
    }
}