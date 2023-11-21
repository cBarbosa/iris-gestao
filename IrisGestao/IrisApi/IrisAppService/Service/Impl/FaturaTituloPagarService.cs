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
    private readonly ITituloPagarRepository tituloPagarRepository;
    private readonly ILogger<IFaturaTituloPagarService> logger;

    public FaturaTituloPagarService(IFaturaTituloPagarRepository FaturaTituloPagarRepository
                        , ITituloPagarRepository TituloPagarRepository
                        , ILogger<IFaturaTituloPagarService> logger)
    {
        this.faturaTituloPagarRepository = FaturaTituloPagarRepository;
        this.tituloPagarRepository= TituloPagarRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> Insert(Guid uuid, FaturaTituloPagarCommand cmd)
    {
        var faturaTituloPagar = new FaturaTituloPagar();
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var tituloPagar = await tituloPagarRepository.GetByReferenceGuid(uuid);

        if (tituloPagar == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        faturaTituloPagar.IdTituloPagar = tituloPagar.Id;
        faturaTituloPagar.NumeroParcela = DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + DateTime.Now.Second;
        faturaTituloPagar.NumeroFatura = tituloPagar.NumeroTitulo + "/" + faturaTituloPagar.NumeroParcela;

        BindBaixaDeFaturaData(cmd, faturaTituloPagar);

        try
        {
            faturaTituloPagarRepository.Insert(faturaTituloPagar);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, faturaTituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
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
                faturaTituloPagar.StatusFatura.Equals(FaturaTituloEnum.PAGO) ||
                faturaTituloPagar.StatusFatura.Equals(FaturaTituloEnum.PARCIAL))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1009, null!);
        }

        int diasAtraso = calculaDiasAtraso(faturaTituloPagar.DataVencimento.Value, cmd.DataPagamento.Value);

        if(cmd.ValorRealPago < faturaTituloPagar.Valor)
            faturaTituloPagar.StatusFatura = FaturaTituloEnum.PARCIAL;
        else
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
                FaturaTituloPagar.StatusFatura = FaturaTituloEnum.A_VENCER;
                FaturaTituloPagar.Status = true;
                break;
            default:
                FaturaTituloPagar.GuidReferencia = FaturaTituloPagar.GuidReferencia;
                FaturaTituloPagar.DataUltimaModificacao = DateTime.Now;
                break;
        }
        if (cmd.numeroFatura.HasValue)
        {
            FaturaTituloPagar.NumeroParcela = cmd.numeroFatura.Value;
        }
        if (cmd.DataPagamento.HasValue)
        {
            FaturaTituloPagar.DiasAtraso = calculaDiasAtraso(cmd.DataVencimento.Value, cmd.DataPagamento.Value);
        }

        FaturaTituloPagar.DataVencimento        = cmd.DataVencimento;
        FaturaTituloPagar.Valor                 = cmd.Valor;
        FaturaTituloPagar.DataPagamento         = cmd.DataPagamento;
        FaturaTituloPagar.ValorRealPago         = cmd.ValorRealPago;
        FaturaTituloPagar.DescricaoBaixaFatura  = cmd.DescricaoBaixaFatura;

        if (FaturaTituloPagar.StatusFatura != null &&
            (FaturaTituloPagar.StatusFatura.Equals(FaturaTituloEnum.PAGO) 
            || FaturaTituloPagar.StatusFatura.Equals(FaturaTituloEnum.PARCIAL)))
        {
            if (cmd.ValorRealPago < cmd.Valor)
                FaturaTituloPagar.StatusFatura = FaturaTituloEnum.PARCIAL;
            else
                FaturaTituloPagar.StatusFatura = FaturaTituloEnum.PAGO;
        }
    }

    private static int calculaDiasAtraso(DateTime dataVencimento, DateTime DataPagamento)
    {
        int diasAtraso = (DataPagamento - dataVencimento).Days;
        return diasAtraso > 0 ? diasAtraso : 0; ;
    }
}