using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

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
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, categoriaImoveis);
    }
}