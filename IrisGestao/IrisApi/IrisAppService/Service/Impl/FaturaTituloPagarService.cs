using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class FaturaTituloPagarService : IFaturaTituloPagarService
{
    private readonly IFaturaTituloPagarRepository faturaTituloPagarRepository;
    private readonly ILogger<IFaturaTituloPagarService> logger;

    public FaturaTituloPagarService(IFaturaTituloPagarRepository FaturaTituloPagarRepository
                        , ILogger<IFaturaTituloPagarService> logger)
    {
        this.faturaTituloPagarRepository = FaturaTituloPagarRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> Update(Guid uuid, FaturaTituloPagarCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var faturaTituloPagar = await faturaTituloPagarRepository.GetByReferenceGuid(uuid);

        if (faturaTituloPagar == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        else if (faturaTituloPagar.StatusFatura.Equals(FaturaTituloEnum.INATIVO))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1009, null!);
        }

        faturaTituloPagar.GuidReferencia = uuid;
        BindBaixaDeFaturaData(cmd, faturaTituloPagar);

        try
        {
            faturaTituloPagarRepository.Update(faturaTituloPagar);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, faturaTituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> BaixarFatura(Guid uuid, BaixarFaturaTituloPagarCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var faturaTituloPagar = await faturaTituloPagarRepository.GetByReferenceGuid(uuid);

        if (faturaTituloPagar == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        else if (faturaTituloPagar.StatusFatura.Equals(FaturaTituloEnum.INATIVO) ||
                faturaTituloPagar.StatusFatura.Equals(FaturaTituloEnum.PAGO))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1009, null!);
        }

        int diasAtraso = calculaDiasAtraso(faturaTituloPagar.DataVencimento.Value, cmd.DataPagamento.Value);

        faturaTituloPagar.StatusFatura = FaturaTituloEnum.PAGO;
        faturaTituloPagar.DescricaoBaixaFatura = cmd.DescricaoBaixaFatura;
        faturaTituloPagar.DataPagamento = cmd.DataPagamento;
        faturaTituloPagar.ValorRealPago = cmd.ValorRealPago;
        faturaTituloPagar.DataUltimaModificacao = DateTime.Now;
        faturaTituloPagar.DiasAtraso = diasAtraso > 0 ? diasAtraso : 0;

        try
        {
            faturaTituloPagarRepository.Update(faturaTituloPagar);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, faturaTituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    private static void BindBaixaDeFaturaData(FaturaTituloPagarCommand cmd, FaturaTituloPagar FaturaTituloPagar)
    {
        switch (FaturaTituloPagar.GuidReferencia)
        {
            case null:
                FaturaTituloPagar.GuidReferencia = Guid.NewGuid();
                FaturaTituloPagar.DataCriacao = DateTime.Now;
                FaturaTituloPagar.DataUltimaModificacao = DateTime.Now;
                break;
            default:
                FaturaTituloPagar.GuidReferencia = FaturaTituloPagar.GuidReferencia;
                FaturaTituloPagar.DataUltimaModificacao = DateTime.Now;
                break;
        }

        FaturaTituloPagar.DataVencimento = cmd.DataVencimento;
        FaturaTituloPagar.Valor          = cmd.Valor;
        FaturaTituloPagar.DataPagamento = cmd.DataPagamento;
        FaturaTituloPagar.ValorRealPago = cmd.ValorRealPago;
        FaturaTituloPagar.DescricaoBaixaFatura = cmd.DescricaoBaixaFatura; 
        /*
        FaturaTituloPagar.NumeroNotaFiscal           = cmd.NumeroNotaFiscal;
        FaturaTituloPagar.DataEmissaoNotaFiscal      = cmd.DataEmissaoNotaFiscal;
        FaturaTituloPagar.DataEnvio                  = cmd.DataEnvio;
        FaturaTituloPagar.Status                     = true;
        //FaturaTituloPagar.StatusFatura               = FaturaTituloEnum.PAGO;
        FaturaTituloPagar.DataPagamento              = cmd.DataPagamento;
        FaturaTituloPagar.ValorRealPago              = cmd.ValorRealPago;
        FaturaTituloPagar.DescricaoBaixaFatura       = cmd.DescricaoBaixaFatura;*/
    }

    private static int calculaDiasAtraso(DateTime dataVencimento, DateTime DataPagamento)
    {
        return (DataPagamento - dataVencimento).Days;
    }
}