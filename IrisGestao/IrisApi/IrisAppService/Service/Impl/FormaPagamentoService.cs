using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

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
            ? new CommandResult(false, ErrorResponseEnums.Error_1000, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1000, FormaPagamentos);
    }
}