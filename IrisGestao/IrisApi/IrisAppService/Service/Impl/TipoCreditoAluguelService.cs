using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TipoCreditoAluguelService : ITipoCreditoAluguelService
{
    private readonly ITipoCreditoAluguelRepository tipoCreditoAluguelRepository;
    
    public TipoCreditoAluguelService(ITipoCreditoAluguelRepository TipoCreditoAluguelRepository)
    {
        this.tipoCreditoAluguelRepository = TipoCreditoAluguelRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var tipoCreditoAluguel = await Task.FromResult(tipoCreditoAluguelRepository.GetAll());

        return !tipoCreditoAluguel.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, tipoCreditoAluguel);
    }
}