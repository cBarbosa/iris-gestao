using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Service.Impl;

public class FormaPagamentoService: IFormaPagamentoService
{
    private readonly IFormaPagamentoRepository formaPagamentoRepository;
    
    public FormaPagamentoService(IFormaPagamentoRepository FormaPagamentoRepository)
    {
        this.formaPagamentoRepository = FormaPagamentoRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var FormaPagamentos = await Task.FromResult(formaPagamentoRepository.GetAll());

        return !FormaPagamentos.Any()
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", FormaPagamentos);
    }
}