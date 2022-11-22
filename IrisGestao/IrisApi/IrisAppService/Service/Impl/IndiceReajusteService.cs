using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Service.Impl;

public class IndiceReajusteService: IIndiceReajusteService
{
    private readonly IIndiceReajusteRepository indiceReajusteRepository;
    
    public IndiceReajusteService(IIndiceReajusteRepository IndiceReajusteRepository)
    {
        this.indiceReajusteRepository = IndiceReajusteRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var categoriaImoveis = await Task.FromResult(indiceReajusteRepository.GetAll());

        return !categoriaImoveis.Any()
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", categoriaImoveis);
    }
}