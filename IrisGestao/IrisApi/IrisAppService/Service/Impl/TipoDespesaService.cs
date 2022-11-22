using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TipoDespesaService: ITipoDespesaService
{
    private readonly ITipoDespesaRepository tipoDespesaRepository;
    
    public TipoDespesaService(ITipoDespesaRepository TipoDespesaRepository)
    {
        this.tipoDespesaRepository = TipoDespesaRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var TipoDespesas = await Task.FromResult(tipoDespesaRepository.GetAll());

        return !TipoDespesas.Any()
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", TipoDespesas);
    }
}