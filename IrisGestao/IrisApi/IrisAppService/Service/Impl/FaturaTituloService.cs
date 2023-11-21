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
    private readonly ITituloReceberRepository tituloReceberRepository;
    private readonly ILogger<IFaturaTituloService> logger;

    public FaturaTituloService(IFaturaTituloRepository FaturaTituloRepository
                        , ITituloReceberRepository TituloReceberRepository
                        , ILogger<IFaturaTituloService> logger)
    {
        this.faturaTituloRepository = FaturaTituloRepository;
        this.tituloReceberRepository = TituloReceberRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> Insert(Guid uuid, BaixaDeFaturaCommand cmd)
    {
        var faturaTitulo = new FaturaTitulo();
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var tituloPagar = await tituloReceberRepository.GetByReferenceGuid(uuid);

        if (tituloPagar == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        faturaTitulo.IdTitulo  = tituloPagar.Id;
        faturaTitulo.NumeroParcela = DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + DateTime.Now.Second;
        faturaTitulo.NumeroFatura = tituloPagar.NumeroTitulo + "/" + faturaTitulo.NumeroParcela;

        BindEditarFaturaData(cmd, faturaTitulo);

        try
        {
            faturaTituloRepository.Insert(faturaTitulo);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, faturaTitulo);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
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
        else if (faturaTitulo.StatusFatura.Equals(FaturaTituloEnum.INATIVO))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1009, null!);
        }

        cmd.GuidFatura = uuid;
        BindEditarFaturaData(cmd, faturaTitulo);

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

    public async Task<CommandResult> BaixarFatura(Guid uuid, BaixaDeFaturaCommand cmd)
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
        else if (faturaTitulo.StatusFatura.Equals(FaturaTituloEnum.INATIVO) ||
                faturaTitulo.StatusFatura.Equals(FaturaTituloEnum.PARCIAL) ||
                faturaTitulo.StatusFatura.Equals(FaturaTituloEnum.PAGO))
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
        int diasAtraso = calculaDiasAtraso(cmd.DataVencimento.Value, cmd.DataPagamento.Value);
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
        if (cmd.ValorRealPago < faturaTitulo.Valor)
            faturaTitulo.StatusFatura = FaturaTituloEnum.PARCIAL;
        else
            faturaTitulo.StatusFatura = FaturaTituloEnum.PAGO;

        faturaTitulo.Status                     = true;
        faturaTitulo.DataPagamento              = cmd.DataPagamento;
        faturaTitulo.ValorRealPago              = cmd.ValorRealPago;
        faturaTitulo.DiasAtraso                 = diasAtraso > 0 ? diasAtraso : 0;
        faturaTitulo.DescricaoBaixaFatura       = cmd.DescricaoBaixaFatura;
    }

    private static void BindEditarFaturaData(BaixaDeFaturaCommand cmd, FaturaTitulo faturaTitulo)
    {
        if(cmd.DataPagamento.HasValue)
        {
            faturaTitulo.DiasAtraso = calculaDiasAtraso(cmd.DataVencimento.Value, cmd.DataPagamento.Value);
        }
        switch (faturaTitulo.GuidReferencia)
        {
            case null:
                faturaTitulo.GuidReferencia = Guid.NewGuid();
                faturaTitulo.DataCriacao = DateTime.Now;
                faturaTitulo.StatusFatura = FaturaTituloEnum.A_VENCER;
                faturaTitulo.Status = true;
                break;
            default:
                faturaTitulo.GuidReferencia = faturaTitulo.GuidReferencia;
                break;
        }
        if (cmd.numeroFatura.HasValue)
        {
            faturaTitulo.NumeroParcela = cmd.numeroFatura.Value;
        }
        faturaTitulo.DataUltimaModificacao = DateTime.Now;
        faturaTitulo.DataVencimento = cmd.DataVencimento.Value;
        faturaTitulo.Valor = cmd.Valor;
        faturaTitulo.DataPagamento = cmd.DataPagamento;
        faturaTitulo.ValorRealPago = cmd.ValorRealPago;
        faturaTitulo.DescricaoBaixaFatura = cmd.DescricaoBaixaFatura;

        if (faturaTitulo.StatusFatura !=null  &&
            (faturaTitulo.StatusFatura.Equals(FaturaTituloEnum.PAGO) 
            || faturaTitulo.StatusFatura.Equals(FaturaTituloEnum.PARCIAL)))
        {
            if (cmd.ValorRealPago < cmd.Valor)
                faturaTitulo.StatusFatura = FaturaTituloEnum.PARCIAL;
            else
                faturaTitulo.StatusFatura = FaturaTituloEnum.PAGO;
        }
    }
    private static int calculaDiasAtraso(DateTime dataVencimento, DateTime DataPagamento)
    {
        int diasAtraso = (DataPagamento - dataVencimento).Days;
        return diasAtraso > 0 ? diasAtraso : 0;
    }
}