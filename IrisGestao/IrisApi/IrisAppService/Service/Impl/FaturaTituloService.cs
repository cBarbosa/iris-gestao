﻿using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class FaturaTituloService : IFaturaTituloService
{
    private readonly IFaturaTituloRepository faturaTituloRepository;
    private readonly ILogger<IFaturaTituloService> logger;

    public FaturaTituloService(IFaturaTituloRepository FaturaTituloRepository
                        , ILogger<IFaturaTituloService> logger)
    {
        this.faturaTituloRepository = FaturaTituloRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> Update(Guid uuid, BaixaDeFaturaCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var faturaTitulo = await faturaTituloRepository.GetByReferenceGuid(uuid);

        if (faturaTitulo == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        else if (faturaTitulo.Status)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1009, null!);
        }

        cmd.GuidFatura = uuid;
        BindBaixaDeFaturaData(cmd, faturaTitulo);

        try
        {
            faturaTituloRepository.Update(faturaTitulo);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, faturaTitulo);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    private static void BindBaixaDeFaturaData(BaixaDeFaturaCommand cmd, FaturaTitulo faturaTitulo)
    {
        int diasAtraso = calculaDiasAtraso(cmd.DataVencimento, cmd.DataPagamento);
        switch (faturaTitulo.GuidReferencia)
        {
            case null:
                faturaTitulo.GuidReferencia = Guid.NewGuid();
                faturaTitulo.DataCriacao = DateTime.Now;
                faturaTitulo.DataUltimaModificacao = DateTime.Now;
                break;
            default:
                faturaTitulo.GuidReferencia = faturaTitulo.GuidReferencia;
                faturaTitulo.DataUltimaModificacao = DateTime.Now;
                break;
        }

        faturaTitulo.NumeroNotaFiscal           = cmd.NumeroNotaFiscal;
        faturaTitulo.DataEmissaoNotaFiscal      = cmd.DataEmissaoNotaFiscal;
        faturaTitulo.Status                     = true;
        faturaTitulo.StatusFatura               = FaturaTituloEnum.PAGO;
        faturaTitulo.DataVencimento             = cmd.DataVencimento;
        faturaTitulo.DataPagamento              = cmd.DataPagamento;
        faturaTitulo.ValorRealPago              = cmd.ValorRealPago;
        faturaTitulo.DiasAtraso                 = diasAtraso > 0 ? diasAtraso : null;
        faturaTitulo.DescricaoBaixaFatura       = cmd.DescricaoBaixaFatura;
    }

    private static int calculaDiasAtraso(DateTime dataVencimento, DateTime DataPagamento)
    {
        return (DataPagamento - dataVencimento).Days;
    }
}