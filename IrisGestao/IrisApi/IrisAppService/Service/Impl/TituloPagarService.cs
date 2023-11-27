﻿using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TituloPagarService: ITituloPagarService
{
    private readonly IContratoAluguelRepository contratoAluguelRepository;
    private readonly ITituloPagarRepository tituloPagarRepository;
    private readonly ITituloImovelRepository tituloImovelRepository;
    private readonly ITituloUnidadeRepository tituloUnidadeRepository;
    private readonly IFaturaTituloPagarRepository faturaTituloPagarRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly IUnidadeRepository unidadeRepository;
    private readonly IClienteRepository clienteRepository;
    private readonly ITipoTituloRepository tipoTituloRepository;
    private readonly ILogger<ITituloPagarService> logger;

    public TituloPagarService(ITituloPagarRepository TituloPagarRepository
                        , ITituloImovelRepository TituloImovelRepository
                        , ITituloUnidadeRepository TituloUnidadeRepository
                        , IFaturaTituloPagarRepository FaturaTituloPagarRepository
                        , IImovelRepository ImovelRepository
                        , IUnidadeRepository UnidadeRepository
                        , IClienteRepository ClienteRepository
                        , IContratoAluguelRepository ContratoAluguelRepository
                        , ITipoTituloRepository TipoTituloRepository
                        , ILogger<ITituloPagarService> logger)
    {
        this.tituloPagarRepository = TituloPagarRepository;
        this.tituloImovelRepository = TituloImovelRepository;
        this.tituloUnidadeRepository = TituloUnidadeRepository;
        this.faturaTituloPagarRepository = FaturaTituloPagarRepository;
        this.imovelRepository = ImovelRepository;
        this.unidadeRepository = UnidadeRepository;
        this.clienteRepository = ClienteRepository;
        this.contratoAluguelRepository = ContratoAluguelRepository;
        this.tipoTituloRepository = TipoTituloRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(string? nomeProprietario, int? idTipoTitulo, int limit, int page)
    {
        var result = await tituloPagarRepository.GetAllPaging(nomeProprietario, idTipoTitulo, limit, page);
        
        return result == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
    }
    
    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        if (guid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var TituloPagar = await tituloPagarRepository.GetByTituloPagarGuid(guid);

        return TituloPagar == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, TituloPagar);
    }

    public async Task<CommandResult> GetAllImoveisTitulo()
    {
        var Imoveis = await tituloPagarRepository.GetAllImoveisTitulo();

        return Imoveis == null || !Imoveis.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Imoveis);
    }

    public async Task<CommandResult> InsertByContratoAluguel(ContratoAluguel contratoAluguel, List<ContratoAluguelImovelCommand> lstContratoImovel)
    {
        var TituloPagar = new TituloPagar();
        List<FaturaTituloPagar> lstFaturaTituloPagar = new List<FaturaTituloPagar>();
        List<TituloPagarImovelCommand> lstTituloImovelCommand = new List<TituloPagarImovelCommand>();
        
        foreach (var contratoImovel in lstContratoImovel)
        {
            TituloPagarImovelCommand tituloImovelCommand = new TituloPagarImovelCommand();
            tituloImovelCommand.guidImovel = contratoImovel.guidImovel;
            tituloImovelCommand.lstUnidades = contratoImovel.lstUnidades;
            lstTituloImovelCommand.Add(tituloImovelCommand);
        }

        var unidadeTaxaAdm = await unidadeRepository.GetByReferenceGuid(lstTituloImovelCommand[0].lstUnidades[0]);
        int sequencial = await tituloPagarRepository.GetNumeroTitulo();
        TituloPagar.Sequencial = sequencial + 1;
        BindTituloPagarByContratoAluguelData(contratoAluguel, TituloPagar, lstFaturaTituloPagar, (double)unidadeTaxaAdm.TaxaAdministracao.Value);

        try
        {
            tituloPagarRepository.Insert(TituloPagar);
            await CriarFaturaTituloPagar(TituloPagar.Id, lstFaturaTituloPagar);
            await CriarTituloImovel(TituloPagar.Id, lstTituloImovelCommand);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, TituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> InsertByContratoFornecedor(ContratoFornecedor contratoFornecedor)
    {
        var TituloPagar = new TituloPagar();
        List<FaturaTituloPagar> lstFaturaTituloPagar = new List<FaturaTituloPagar>();

        int sequencial = await tituloPagarRepository.GetNumeroTitulo();
        TituloPagar.Sequencial = sequencial + 1;
        BindTituloPagarByContratoFornecedorData(contratoFornecedor, TituloPagar, lstFaturaTituloPagar);

        try
        {
            tituloPagarRepository.Insert(TituloPagar);
            await CriarFaturaTituloPagar(TituloPagar.Id, lstFaturaTituloPagar);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, TituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Insert(CriarTituloPagarCommand cmd)
    {
        var TituloPagar = new TituloPagar();
        List<FaturaTituloPagar> lstFaturaTituloPagar = new List<FaturaTituloPagar>();
        if (cmd.GuidCliente.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(new Guid(cmd.GuidCliente));
        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }
        int? sequencial = await tituloPagarRepository.GetNumeroTitulo();

        var tipoTitulo = await tipoTituloRepository.GetById(cmd.IdTipoTitulo);
        TituloPagar.NomeTitulo = tipoTitulo?.Nome;

        TituloPagar.Sequencial = sequencial.Value + 1;
        BindTituloPagarData(cmd, TituloPagar, lstFaturaTituloPagar);
        TituloPagar.IdCliente = cliente.Id;

        try
        {
            tituloPagarRepository.Insert(TituloPagar);
            await CriarFaturaTituloPagar(TituloPagar.Id, lstFaturaTituloPagar);
            await CriarTituloImovel(TituloPagar.Id, cmd.lstImoveis);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, TituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarTituloPagarCommand cmd)
    {
        List<FaturaTituloPagar> lstFaturaTituloPagar = new List<FaturaTituloPagar>();
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        Cliente cliente = null;
        if(!String.IsNullOrWhiteSpace(cmd.GuidCliente))
        {
            cliente = await clienteRepository.GetByReferenceGuid(new Guid(cmd.GuidCliente));
        }
        
        var TituloPagar = await tituloPagarRepository.GetByReferenceGuid(uuid);

        if (TituloPagar == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cmd.GuidReferencia = uuid;
        TituloPagar.IdCliente = cliente == null ? null : cliente.Id;
        BindTituloPagarData(cmd, TituloPagar, lstFaturaTituloPagar);

        try
        {
            tituloPagarRepository.Update(TituloPagar);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, TituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> AtualizarReajuste(ContratoAluguel contratoAluguel)
    {
        List<FaturaTituloPagar> lstFaturaTituloPagar = new List<FaturaTituloPagar>();
        if (contratoAluguel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var TituloPagar = await tituloPagarRepository.GetByContratoAluguelId(contratoAluguel.Id);

        if (TituloPagar == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }


        BindTituloPagarReajusteData(contratoAluguel, TituloPagar, lstFaturaTituloPagar);

        try
        {
            tituloPagarRepository.Update(TituloPagar);
            await CriarFaturaTituloPagar(TituloPagar.Id, lstFaturaTituloPagar);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, TituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> InativarTitulo(ContratoAluguel contratoAluguel)
    {
        List<FaturaTituloPagar> lstFaturaTitulo = new List<FaturaTituloPagar>();
        if (contratoAluguel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var TituloPagar = await tituloPagarRepository.GetByContratoAluguelId(contratoAluguel.Id);
        var lstFaturasTitulo = await faturaTituloPagarRepository.GetFaturasByTitulo(TituloPagar.Id);
        if (lstFaturasTitulo == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        try
        {
            TituloPagar.Status = false;
            foreach (var fatura in lstFaturasTitulo)
            {
                if (String.IsNullOrWhiteSpace(fatura.StatusFatura)
                    || fatura.StatusFatura.Equals(FaturaTituloEnum.VENCIDO)
                    || fatura.StatusFatura.Equals(FaturaTituloEnum.A_VENCER))
                {
                    fatura.DataUltimaModificacao = DateTime.Now;
                    fatura.Status = false;
                    fatura.StatusFatura = FaturaTituloEnum.INATIVO;
                    fatura.DescricaoBaixaFatura = "Fatura cancelada devido cancelamento do contrato de aluguel";
                    faturaTituloPagarRepository.Update(fatura);
                }
            }
            tituloPagarRepository.Update(TituloPagar);

            return new CommandResult(true, SuccessResponseEnums.Success_1001, TituloPagar);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    private async Task CriarFaturaTituloPagar(int idTituloPagar, List<FaturaTituloPagar> lstFaturaTituloPagar)
    {
        foreach (FaturaTituloPagar faturaTituloPagar in lstFaturaTituloPagar)
        {
            faturaTituloPagar.IdTituloPagar = idTituloPagar;
            faturaTituloPagarRepository.Insert(faturaTituloPagar);
        }
    }

    private async Task CriarTituloImovel(int idTituloPagar, List<TituloPagarImovelCommand> lstTituloImovel)
    {
        foreach (TituloPagarImovelCommand contratoImovel in lstTituloImovel)
        {
            var tituoImovel = new TituloImovel();
            tituoImovel.IdTituloPagar = idTituloPagar;

            var imovel = await imovelRepository.GetByReferenceGuid(contratoImovel.guidImovel);

            if (imovel != null)
            {
                tituoImovel.IdImovel = imovel.Id;
                tituloImovelRepository.Insert(tituoImovel);
                await CriaTituloUnidades(tituoImovel.Id, contratoImovel.lstUnidades);
            }
        }
    }

    private async Task CriaTituloUnidades(int idTituoImovel, List<Guid> lstTituloUnidades)
    {
        foreach (Guid unidadeTitulo in lstTituloUnidades)
        {
            var tituloUnidade = new TituloUnidade();
            tituloUnidade.IdTituloImovel = idTituoImovel;

            Unidade unidade = await unidadeRepository.GetByReferenceGuid(unidadeTitulo);

            if (unidade != null)
            {
                tituloUnidade.IdUnidade = unidade.Id;
            }
            tituloUnidadeRepository.Insert(tituloUnidade);
        }
    }

    private static void BindTituloPagarByContratoAluguelData(ContratoAluguel contratoAluguel, TituloPagar TituloPagar, List<FaturaTituloPagar> lstFaturaTituloPagar, Double unidadeTaxaAdministracao)
    {
        double ValorAPagar = 0;
        int prazo = contratoAluguel.PrazoTotalContrato > 12 ? 12 : contratoAluguel.PrazoTotalContrato;
        int prazoFaturas = contratoAluguel.PrazoCarencia.HasValue ?
               (prazo - contratoAluguel.PrazoCarencia.Value) :
               prazo;
        int prazoDesconto = contratoAluguel.PrazoDesconto.HasValue ? contratoAluguel.PrazoDesconto.Value : 0;
        int prazoImpostos = prazoFaturas - prazoDesconto;
        //ValorAPagar = calcularPorcentagemContratoAluguel(contratoAluguel.ValorAluguel, unidadeTaxaAdministracao) * prazoImpostos;
        
        if (contratoAluguel.PrazoDesconto.HasValue)
        {
            ValorAPagar = calcularPorcentagemContratoAluguel(contratoAluguel.ValorComDesconto.Value, unidadeTaxaAdministracao) * prazoDesconto;
        }

        ValorAPagar += calcularPorcentagemContratoAluguel(contratoAluguel.ValorComImpostos.Value, unidadeTaxaAdministracao) * prazoImpostos;
        
        switch (TituloPagar.GuidReferencia)
        {
            case null:
                TituloPagar.GuidReferencia = Guid.NewGuid();
                TituloPagar.DataCriacao = DateTime.Now;
                break;
            default:
                TituloPagar.GuidReferencia = TituloPagar.GuidReferencia;
                break;
        }

        TituloPagar.DataUltimaModificacao = DateTime.Now;
        TituloPagar.NumeroTitulo = TituloPagar.Sequencial + "/" + DateTime.Now.Year;
        TituloPagar.NomeTitulo = "Taxa de administração";
        TituloPagar.IdTipoTitulo = TipoTituloReceberEnum.TAXA_ADMINISTRACAO;
        TituloPagar.IdFormaPagamento = FormaPagamentoEnum.BOLETO;
        TituloPagar.Status = true;
        TituloPagar.DataFimTitulo = contratoAluguel.DataFimContrato;
        TituloPagar.IdContratoAluguel = contratoAluguel.Id;
        TituloPagar.IdCliente = contratoAluguel?.IdCliente;
        TituloPagar.IdIndiceReajuste = contratoAluguel?.IdIndiceReajuste;
        TituloPagar.IdTipoCreditoAluguel = contratoAluguel?.IdTipoCreditoAluguel;
        TituloPagar.ValorTitulo = calcularPorcentagemContratoAluguel(contratoAluguel.ValorComImpostos.Value, unidadeTaxaAdministracao);
        TituloPagar.ValorTotalTitulo = ValorAPagar;
        TituloPagar.Parcelas = prazo;
        TituloPagar.DataVencimentoPrimeraParcela = contratoAluguel.DataVencimentoPrimeraParcela;
        TituloPagar.PorcentagemTaxaAdministracao = unidadeTaxaAdministracao;

        BindFaturaTituloByContratoAluguelData(contratoAluguel, TituloPagar, lstFaturaTituloPagar, unidadeTaxaAdministracao);
    }

    private static List<FaturaTituloPagar> BindFaturaTituloByContratoAluguelData(ContratoAluguel contratoAluguel, TituloPagar TituloPagar, List<FaturaTituloPagar> lstFaturaTituloPagar, Double unidadeTaxaAdministracao)
    {
        int contaDesconto = 1;
        for (int i = 0; i < contratoAluguel.PrazoTotalContrato; i++)
        {
            if (i > 11)
                break;

            DateTime dataVencimento = TituloPagar.DataVencimentoPrimeraParcela.Value.AddMonths(i);
            int diaVencimento = TituloPagar.DataVencimentoPrimeraParcela.Value.Day > 28 ? 28 : dataVencimento.Day;
            double ValorAPagar = 0;
            
            if (contratoAluguel.PrazoCarencia.HasValue)
            {
                if (contratoAluguel.PrazoCarencia > i)
                {
                    ValorAPagar = 0.00;
                }
                else if (contratoAluguel.PrazoDesconto.HasValue)
                {
                    if (contratoAluguel.PrazoDesconto >= contaDesconto)
                    {
                        ValorAPagar = calcularPorcentagemContratoAluguel(contratoAluguel.ValorComDesconto.Value, unidadeTaxaAdministracao);
                        contaDesconto++;
                    }
                    else
                    {
                        ValorAPagar = calcularPorcentagemContratoAluguel(contratoAluguel.ValorComImpostos.Value, unidadeTaxaAdministracao);
                    }
                }
                else
                {
                    ValorAPagar = calcularPorcentagemContratoAluguel(contratoAluguel.ValorComImpostos.Value, unidadeTaxaAdministracao);
                }
            }
            else
            {
                ValorAPagar = calcularPorcentagemContratoAluguel(contratoAluguel.ValorComImpostos.Value, unidadeTaxaAdministracao);
            }

            FaturaTituloPagar faturaTituloPagar      = new FaturaTituloPagar();
            faturaTituloPagar.StatusFatura           = FaturaTituloEnum.A_VENCER;
            faturaTituloPagar.NumeroParcela          = i+1;
            faturaTituloPagar.Status                 = true;
            faturaTituloPagar.DataCriacao            = DateTime.Now;
            faturaTituloPagar.DataUltimaModificacao  = DateTime.Now;
            faturaTituloPagar.GuidReferencia         = Guid.NewGuid();
            faturaTituloPagar.NumeroFatura           = TituloPagar.NumeroTitulo + "/" + (i+1).ToString("D2");
            faturaTituloPagar.Valor                  = ValorAPagar;
            faturaTituloPagar.DataVencimento         = new DateTime(dataVencimento.Year, dataVencimento.Month, diaVencimento);

            lstFaturaTituloPagar.Add(faturaTituloPagar);
        }
        return lstFaturaTituloPagar;
    }

    private static void BindTituloPagarByContratoFornecedorData(ContratoFornecedor contratoFornecedor, TituloPagar TituloPagar, List<FaturaTituloPagar> lstFaturaTituloPagar)
    {
        double ValorAPagarTotal = 0;
        ValorAPagarTotal = calcularPorcentagemContratoAluguel(contratoFornecedor.ValorServicoContratado, 
            contratoFornecedor.Percentual.HasValue ? contratoFornecedor.Percentual.Value : 0) * contratoFornecedor.PrazoTotalMeses;

        switch (TituloPagar.GuidReferencia)
        {
            case null:
                TituloPagar.GuidReferencia = Guid.NewGuid();
                TituloPagar.DataCriacao = DateTime.Now;
                break;
            default:
                TituloPagar.GuidReferencia = TituloPagar.GuidReferencia;
                break;
        }

        TituloPagar.DataUltimaModificacao = DateTime.Now;
        TituloPagar.NumeroTitulo = TituloPagar.Sequencial + "/" + DateTime.Now.Year;
        TituloPagar.NomeTitulo = "Reembolso Contrato Fornecedor";
        TituloPagar.IdTipoTitulo = TipoTituloReceberEnum.REEMBOLSO;
        TituloPagar.IdFormaPagamento = FormaPagamentoEnum.BOLETO;
        TituloPagar.Status = true;
        TituloPagar.DataFimTitulo = contratoFornecedor.DataFimContrato;
        //TituloPagar.IdContratoAluguel = contratoFornecedor.Id;
        TituloPagar.IdCliente = contratoFornecedor?.IdImovelNavigation?.IdClienteProprietario;
        TituloPagar.IdIndiceReajuste = contratoFornecedor?.IdIndiceReajuste;
        TituloPagar.IdTipoCreditoAluguel = TipoCreditoAluguelEnum.LOCADOR;
        TituloPagar.ValorTitulo = calcularPorcentagemContratoAluguel(contratoFornecedor.ValorServicoContratado, contratoFornecedor.Percentual.HasValue? contratoFornecedor.Percentual.Value : 0);
        TituloPagar.ValorTotalTitulo = ValorAPagarTotal;
        TituloPagar.Parcelas = contratoFornecedor.PrazoTotalMeses;
        TituloPagar.DataVencimentoPrimeraParcela = contratoFornecedor.DataVencimentoPrimeraParcela;
        TituloPagar.PorcentagemTaxaAdministracao = contratoFornecedor.Percentual;

        //BindFaturaTituloByContratoAluguelData(contratoFornecedor, TituloPagar, lstFaturaTituloPagar, unidadeTaxaAdministracao);
    }

    private static void BindTituloPagarData(CriarTituloPagarCommand cmd, TituloPagar TituloPagar,  List<FaturaTituloPagar> lstFaturaTituloPagar)
    {
        Boolean criacao = false;
        double valorLiquido;
        valorLiquido = calcularPorcentagem(cmd.ValorTitulo, cmd.PorcentagemImpostoRetido);
        switch (TituloPagar.GuidReferencia)
        {
            case null:
                TituloPagar.GuidReferencia = Guid.NewGuid();
                TituloPagar.DataCriacao = DateTime.Now;
                TituloPagar.DataUltimaModificacao = DateTime.Now;
                TituloPagar.NumeroTitulo = TituloPagar.Sequencial + "/" + DateTime.Now.Year;
                TituloPagar.ValorTotalTitulo = valorLiquido * cmd.Parcelas;
                TituloPagar.DataFimTitulo = cmd.DataVencimentoPrimeraParcela.AddMonths(cmd.Parcelas.Value);
                TituloPagar.Status = true;
                criacao = true;
                break;
            default:
                TituloPagar.GuidReferencia = TituloPagar.GuidReferencia;
                TituloPagar.DataUltimaModificacao = DateTime.Now;
                TituloPagar.ValorTotalTitulo = valorLiquido * TituloPagar.Parcelas;
                TituloPagar.DataFimTitulo = cmd.DataVencimentoPrimeraParcela;
                break;
        }

        TituloPagar.NomeTitulo                        = String.IsNullOrEmpty(cmd.NomeTitulo) ? TituloPagar.NomeTitulo : cmd.NomeTitulo;
        TituloPagar.IdTipoTitulo                      = cmd.IdTipoTitulo;
        TituloPagar.DataVencimentoPrimeraParcela      = cmd.DataVencimentoPrimeraParcela;
        TituloPagar.IdContratoAluguel                 = null;
        TituloPagar.IdIndiceReajuste                  = cmd.IdIndiceReajuste.HasValue ? cmd.IdIndiceReajuste : TituloPagar.IdIndiceReajuste;
        TituloPagar.IdTipoCreditoAluguel              = cmd.IdTipoCreditoAluguel.HasValue ? cmd.IdTipoCreditoAluguel : TituloPagar.IdTipoCreditoAluguel;
        TituloPagar.IdFormaPagamento                  = cmd.IdFormaPagamento;
        TituloPagar.ValorTitulo                       = valorLiquido;
        //TituloPagar.DiaPagamento                      = cmd.DataPagamento.Day;
        TituloPagar.Parcelas                          = cmd.Parcelas.HasValue ? cmd.Parcelas.Value : TituloPagar.Parcelas;
        TituloPagar.PorcentagemTaxaAdministracao      = cmd.PorcentagemImpostoRetido;


        if (criacao)
            BindFaturaTituloData(TituloPagar, lstFaturaTituloPagar);
    }

    private static List<FaturaTituloPagar> BindFaturaTituloData(TituloPagar TituloPagar, List<FaturaTituloPagar> lstFaturaTituloPagar)
    {
        for (int i = 0; i < TituloPagar.Parcelas; i++)
        {
            if (i > 11)
                break;

            DateTime dataVencimento = TituloPagar.DataVencimentoPrimeraParcela.Value.AddMonths(i);
            int diaVencimento = dataVencimento.Day > 28 ? 28 : TituloPagar.DataVencimentoPrimeraParcela.Value.Day;

            FaturaTituloPagar faturaTituloPagar              = new FaturaTituloPagar();
            faturaTituloPagar.NumeroParcela                  = i+1;
            faturaTituloPagar.Status                         = true;
            faturaTituloPagar.StatusFatura                   = FaturaTituloEnum.A_VENCER;
            faturaTituloPagar.DataCriacao                    = DateTime.Now;
            faturaTituloPagar.DataUltimaModificacao          = DateTime.Now;
            faturaTituloPagar.GuidReferencia                 = Guid.NewGuid();
            faturaTituloPagar.NumeroFatura                   = TituloPagar.NumeroTitulo + "/" + (i + 1).ToString("D2");
            faturaTituloPagar.Valor                          = TituloPagar.ValorTitulo;
            faturaTituloPagar.DataVencimento                 = new DateTime(dataVencimento.Year, dataVencimento.Month, diaVencimento);

            lstFaturaTituloPagar.Add(faturaTituloPagar);
        }
        return lstFaturaTituloPagar;
    }

    private static void BindTituloPagarReajusteData(ContratoAluguel contratoAluguel, TituloPagar tituloPagar, List<FaturaTituloPagar> lstFaturaTituloPagar)
    {
        DateTime dataVencimento = tituloPagar.DataFimTitulo.Value.AddMonths(12);
        tituloPagar.DataUltimaModificacao = DateTime.Now;
        tituloPagar.DataFimTitulo = tituloPagar.DataFimTitulo.Value >= dataVencimento ? tituloPagar.DataFimTitulo : dataVencimento;

        tituloPagar.ValorTitulo = calcularPorcentagemContratoAluguel(contratoAluguel.ValorAluguel, tituloPagar.PorcentagemTaxaAdministracao.Value);
        tituloPagar.ValorTotalTitulo = (tituloPagar.ValorTotalTitulo + (tituloPagar.ValorTitulo * 12));
        tituloPagar.Parcelas = tituloPagar.Parcelas + 12;

        BindFaturaTituloReajusteData(contratoAluguel, tituloPagar, lstFaturaTituloPagar);
    }

    private static List<FaturaTituloPagar> BindFaturaTituloReajusteData(ContratoAluguel contratoAluguel, TituloPagar TituloPagar, List<FaturaTituloPagar> lstFaturaTituloPagar)
    {
        for (int i = 12; i < 24; i++)
        {
            int diaVencimento = TituloPagar.DataVencimentoPrimeraParcela.Value.Day;
            DateTime dataVencimento = TituloPagar.DataVencimentoPrimeraParcela.Value.AddMonths(i);

            FaturaTituloPagar faturaTituloPagar = new FaturaTituloPagar();
            faturaTituloPagar.IdTituloPagar = TituloPagar.Id;
            faturaTituloPagar.NumeroParcela = i+1;
            faturaTituloPagar.Status = true;
            faturaTituloPagar.StatusFatura = FaturaTituloEnum.A_VENCER;
            faturaTituloPagar.DataCriacao = DateTime.Now;
            faturaTituloPagar.DataUltimaModificacao = DateTime.Now;
            faturaTituloPagar.GuidReferencia = Guid.NewGuid();
            faturaTituloPagar.NumeroFatura = TituloPagar.NumeroTitulo + "/" + (i + 1).ToString("D2");
            faturaTituloPagar.Valor = calcularPorcentagemContratoAluguel(contratoAluguel.ValorAluguel, TituloPagar.PorcentagemTaxaAdministracao.Value);
            faturaTituloPagar.DataVencimento = new DateTime(dataVencimento.Year, dataVencimento.Month, dataVencimento.Day);

            lstFaturaTituloPagar.Add(faturaTituloPagar);
        }
        return lstFaturaTituloPagar;
    }

    private static double calcularPorcentagem(double valor, double percentual)
    {
        double desconto = ((double)valor / 100) * percentual;
        return Math.Round(valor - desconto, 2);
    }

    private static double calcularPorcentagemContratoAluguel(double valor, Double valorTaxaAdministracao)
    {
        double desconto = ((double)valor / 100) * valorTaxaAdministracao;
        return desconto;
    }
}