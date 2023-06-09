using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TituloReceberService: ITituloReceberService
{
    private readonly IContratoAluguelRepository contratoAluguelRepository;
    private readonly ITituloReceberRepository tituloReceberRepository;
    private readonly ITituloImovelRepository tituloImovelRepository;
    private readonly ITituloUnidadeRepository tituloUnidadeRepository;
    private readonly IFaturaTituloRepository faturaTituloRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly IUnidadeRepository unidadeRepository;
    private readonly IClienteRepository clienteRepository;
    private readonly ITipoTituloRepository tipoTituloRepository;
    private readonly ILogger<ITituloReceberService> logger;

    public TituloReceberService(ITituloReceberRepository TituloReceberRepository
                        , ITituloImovelRepository TituloImovelRepository
                        , ITituloUnidadeRepository TituloUnidadeRepository
                        , IFaturaTituloRepository FaturaTituloRepository
                        , IImovelRepository ImovelRepository
                        , IUnidadeRepository UnidadeRepository
                        , IClienteRepository ClienteRepository
                        , IContratoAluguelRepository ContratoAluguelRepository
                        , ITipoTituloRepository TipoTituloRepository
                        , ILogger<ITituloReceberService> logger)
    {
        this.tituloReceberRepository = TituloReceberRepository;
        this.tituloImovelRepository = TituloImovelRepository;
        this.tituloUnidadeRepository = TituloUnidadeRepository;
        this.faturaTituloRepository = FaturaTituloRepository;
        this.imovelRepository = ImovelRepository;
        this.unidadeRepository = UnidadeRepository;
        this.clienteRepository = ClienteRepository;
        this.contratoAluguelRepository = ContratoAluguelRepository;
        this.tipoTituloRepository = TipoTituloRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(string? numeroTitulo, int? idTipoTitulo, int limit, int page)
    {
        var result = await tituloReceberRepository.GetAllPaging(numeroTitulo, idTipoTitulo, limit, page);
        
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

        var tituloReceber = await tituloReceberRepository.GetByTituloReceberGuid(guid);

        return tituloReceber == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, tituloReceber);
    }

    public async Task<CommandResult> InsertByContratoAluguel(ContratoAluguel contratoAluguel, List<ContratoAluguelImovelCommand> lstContratoImovel)
    {
        var tituloReceber = new TituloReceber();
        List<FaturaTitulo> lstFaturaTitulo = new List<FaturaTitulo>();
        List<TituloImovelCommand> lstTituloImovelCommand = new List<TituloImovelCommand>();
        
        foreach (var contratoImovel in lstContratoImovel)
        {
            TituloImovelCommand tituloImovelCommand = new TituloImovelCommand();
            tituloImovelCommand.guidImovel = contratoImovel.guidImovel;
            tituloImovelCommand.lstUnidades = contratoImovel.lstUnidades;
            lstTituloImovelCommand.Add(tituloImovelCommand);
        }

        int sequencial = await tituloReceberRepository.GetNumeroTitulo();
        tituloReceber.Sequencial = sequencial + 1;
        BindTituloReceberByContratoAluguelData(contratoAluguel, tituloReceber, lstFaturaTitulo);

        try
        {
            tituloReceberRepository.Insert(tituloReceber);
            await CriarFaturaTituloReceber(tituloReceber.Id, lstFaturaTitulo);
            await CriarTituloImovel(tituloReceber.Id, lstTituloImovelCommand);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, tituloReceber);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Insert(CriarTituloReceberCommand cmd)
    {
        var tituloReceber = new TituloReceber();
        List<FaturaTitulo> lstFaturaTitulo = new List<FaturaTitulo>();
        if (cmd.GuidCliente.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.GuidCliente);
        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }
        int? sequencial = await tituloReceberRepository.GetNumeroTitulo();

        var tipoTitulo = await tipoTituloRepository.GetById(cmd.IdTipoTitulo);
        tituloReceber.NomeTitulo = tipoTitulo?.Nome;
        tituloReceber.Sequencial = sequencial.Value + 1;
        BindTituloReceberData(cmd, tituloReceber, lstFaturaTitulo);
        tituloReceber.IdCliente = cliente.Id;

        try
        {
            tituloReceberRepository.Insert(tituloReceber);
            await CriarFaturaTituloReceber(tituloReceber.Id, lstFaturaTitulo);
            await CriarTituloImovel(tituloReceber.Id, cmd.lstImoveis);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, tituloReceber);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarTituloReceberCommand cmd)
    {
        List<FaturaTitulo> lstFaturaTitulo = new List<FaturaTitulo>();
        if (cmd == null || uuid.Equals(Guid.Empty) || cmd.GuidCliente.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.GuidCliente);

        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        var tituloReceber = await tituloReceberRepository.GetByReferenceGuid(uuid);

        if (tituloReceber == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cmd.GuidReferencia = uuid;
        BindTituloReceberData(cmd, tituloReceber, lstFaturaTitulo);

        try
        {
            tituloReceberRepository.Update(tituloReceber);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, tituloReceber);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> AtualizarReajuste(ContratoAluguel contratoAluguel)
    {
        List<FaturaTitulo> lstFaturaTitulo = new List<FaturaTitulo>();
        if (contratoAluguel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var tituloReceber = await tituloReceberRepository.GetByContratoAluguelId(contratoAluguel.Id);

        if (tituloReceber == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        BindTituloReceberReajusteData(contratoAluguel, tituloReceber, lstFaturaTitulo);

        try
        {
            tituloReceberRepository.Update(tituloReceber);
            await CriarFaturaTituloReceber(tituloReceber.Id, lstFaturaTitulo);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, tituloReceber);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> InativarTitulo(ContratoAluguel contratoAluguel)
    {
        List<FaturaTitulo> lstFaturaTitulo = new List<FaturaTitulo>();
        if (contratoAluguel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var tituloReceber = await tituloReceberRepository.GetByContratoAluguelId(contratoAluguel.Id);
        var lstFaturasTitulo = await faturaTituloRepository.GetFaturasByTitulo(tituloReceber.Id);
        if (lstFaturasTitulo == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        try
        {
            tituloReceber.Status = false;
            foreach (var fatura in lstFaturasTitulo)
            {
                fatura.Status = false;
                fatura.StatusFatura = FaturaTituloEnum.INATIVO;
                fatura.DescricaoBaixaFatura = "Fatura cancelada devido cancelamento do contrato de aluguel";
                faturaTituloRepository.Update(fatura);
            }
            tituloReceberRepository.Update(tituloReceber);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, tituloReceber);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    private async Task CriarFaturaTituloReceber(int idTituloReceber, List<FaturaTitulo> lstFaturaTitulo)
    {
        foreach (FaturaTitulo faturaTitulo in lstFaturaTitulo)
        {
            faturaTitulo.IdTitulo = idTituloReceber;
            faturaTituloRepository.Insert(faturaTitulo);
        }
    }

    private async Task CriarTituloImovel(int idTituloReceber, List<TituloImovelCommand> lstTituloImovel)
    {
        foreach (TituloImovelCommand contratoImovel in lstTituloImovel)
        {
            var tituoImovel = new TituloImovel();
            tituoImovel.IdTituloReceber = idTituloReceber;

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

    private static void BindTituloReceberByContratoAluguelData(ContratoAluguel contratoAluguel, TituloReceber tituloReceber, List<FaturaTitulo> lstFaturaTitulo)
    {
        int prazo = contratoAluguel.PrazoTotalContrato > 12 ? 12 : contratoAluguel.PrazoTotalContrato;
        int prazoFaturas = contratoAluguel.PrazoCarencia.HasValue ?
               (prazo - contratoAluguel.PrazoCarencia.Value) :
               prazo;

        switch (tituloReceber.GuidReferencia)
        {
            case null:
                tituloReceber.GuidReferencia = Guid.NewGuid();
                tituloReceber.DataCriacao = DateTime.Now;
                tituloReceber.DataUltimaModificacao = DateTime.Now;
                break;
            default:
                tituloReceber.GuidReferencia = tituloReceber.GuidReferencia;
                tituloReceber.DataUltimaModificacao = DateTime.Now;
                break;
        }

        tituloReceber.NumeroTitulo = tituloReceber.Sequencial + "/" + DateTime.Now.Year;
        tituloReceber.NomeTitulo = "Aluguel";
        tituloReceber.IdTipoTitulo = TipoTituloReceberEnum.ALUGUEL;
        tituloReceber.IdFormaPagamento = FormaPagamentoEnum.BOLETO;
        tituloReceber.Status = true;
        tituloReceber.DataFimTitulo = contratoAluguel.DataFimContrato;
        tituloReceber.IdContratoAluguel = contratoAluguel.Id;
        tituloReceber.IdCliente = contratoAluguel?.IdCliente;
        tituloReceber.IdIndiceReajuste = contratoAluguel?.IdIndiceReajuste;
        tituloReceber.IdTipoCreditoAluguel = contratoAluguel?.IdTipoCreditoAluguel;
        tituloReceber.ValorTitulo = contratoAluguel.ValorAluguel;
        tituloReceber.ValorTotalTitulo = contratoAluguel.ValorAluguelLiquido;
        tituloReceber.Parcelas = prazo;
        tituloReceber.DataVencimentoPrimeraParcela = contratoAluguel.DataVencimentoPrimeraParcela;
        tituloReceber.PorcentagemTaxaAdministracao = contratoAluguel.PercentualRetencaoImpostos;

        BindFaturaTituloByContratoAluguelData(contratoAluguel, tituloReceber, lstFaturaTitulo);
    }

    private static List<FaturaTitulo> BindFaturaTituloByContratoAluguelData(ContratoAluguel contratoAluguel, TituloReceber tituloReceber, List<FaturaTitulo> lstFaturaTitulo)
    {
        int contaDesconto = 1;
        for (int i = 0; i < contratoAluguel.PrazoTotalContrato; i++)
        {
            if (i > 11)
                break;

            double ValorAPagar = contratoAluguel.ValorComImpostos.Value;

            if (contratoAluguel.PrazoCarencia.HasValue)
            {
                if (contratoAluguel.PrazoCarencia > i)
                {
                    ValorAPagar = 0.00;
                }
                else if(contratoAluguel.PrazoDesconto.HasValue)
                {
                    if (contratoAluguel.PrazoDesconto >= contaDesconto)
                    {
                        ValorAPagar = contratoAluguel.ValorComDesconto.Value;
                        contaDesconto++;
                    }
                }
            }

            DateTime dataVencimento = tituloReceber.DataVencimentoPrimeraParcela.Value.AddMonths(i);
            int diaVencimento = tituloReceber.DataVencimentoPrimeraParcela.Value.Day > 28 ? 28 : dataVencimento.Day;

            FaturaTitulo faturaTitulo           = new FaturaTitulo();
            faturaTitulo.StatusFatura           = FaturaTituloEnum.A_VENCER;
            faturaTitulo.NumeroParcela          = i+1;
            faturaTitulo.Status                 = true;
            faturaTitulo.DataCriacao            = DateTime.Now;
            faturaTitulo.DataUltimaModificacao  = DateTime.Now;
            faturaTitulo.GuidReferencia         = Guid.NewGuid();
            faturaTitulo.NumeroFatura           = tituloReceber.NumeroTitulo + "/" + (i+1).ToString("D2");
            faturaTitulo.Valor                  = ValorAPagar;
            faturaTitulo.DataVencimento         = new DateTime(dataVencimento.Year, dataVencimento.Month, diaVencimento);

            lstFaturaTitulo.Add(faturaTitulo);
        }
        return lstFaturaTitulo;
    }

    private static void BindTituloReceberData(CriarTituloReceberCommand cmd, TituloReceber tituloReceber,  List<FaturaTitulo> lstFaturaTitulo)
    {
        Boolean criacao = false;
        double valorLiquido;
        valorLiquido = calcularPorcentagem(cmd.ValorTitulo, cmd.PorcentagemImpostoRetido);
        switch (tituloReceber.GuidReferencia)
        {
            case null:
                tituloReceber.GuidReferencia = Guid.NewGuid();
                tituloReceber.DataCriacao = DateTime.Now;
                tituloReceber.DataUltimaModificacao = DateTime.Now;
                criacao = true;
                break;
            default:
                tituloReceber.GuidReferencia = tituloReceber.GuidReferencia;
                tituloReceber.DataUltimaModificacao = DateTime.Now;
                break;
        }

        tituloReceber.NumeroTitulo                      = tituloReceber.Sequencial +"/"+ DateTime.Now.Year;
        tituloReceber.NomeTitulo                        = string.IsNullOrEmpty(cmd.NomeTitulo) ? tituloReceber.NomeTitulo : cmd.NomeTitulo;
        tituloReceber.IdTipoTitulo                      = cmd.IdTipoTitulo;
        tituloReceber.Status                            = true;
        tituloReceber.DataFimTitulo                     = cmd.DataVencimentoPrimeraParcela.AddMonths(cmd.Parcelas);
        tituloReceber.DataVencimentoPrimeraParcela      = cmd.DataVencimentoPrimeraParcela;
        tituloReceber.IdContratoAluguel                 = null;
        tituloReceber.IdIndiceReajuste                  = cmd.IdIndiceReajuste;
        tituloReceber.IdTipoCreditoAluguel              = cmd.IdTipoCreditoAluguel;
        tituloReceber.IdFormaPagamento                  = cmd.IdFormaPagamento;
        tituloReceber.ValorTitulo                       = valorLiquido;
        tituloReceber.ValorTotalTitulo                  = valorLiquido * cmd.Parcelas;
        tituloReceber.Parcelas                          = cmd.Parcelas;
        tituloReceber.PorcentagemTaxaAdministracao      = cmd.PorcentagemImpostoRetido;

        if(criacao)
            BindFaturaTituloData(tituloReceber, lstFaturaTitulo);
    }

    private static List<FaturaTitulo> BindFaturaTituloData(TituloReceber tituloReceber, List<FaturaTitulo> lstFaturaTitulo)
    {
        for (int i = 0; i < tituloReceber.Parcelas; i++)
        {
            if (i > 11)
                break;

            DateTime dataVencimento = tituloReceber.DataVencimentoPrimeraParcela.Value.AddMonths(i);
            int diaVencimento = dataVencimento.Day > 28 ? 28 : tituloReceber.DataVencimentoPrimeraParcela.Value.Day;

            FaturaTitulo faturaTitulo                   = new FaturaTitulo();
            faturaTitulo.NumeroParcela                  = i+1;
            faturaTitulo.Status                         = true;
            faturaTitulo.StatusFatura                   = FaturaTituloEnum.A_VENCER;
            faturaTitulo.DataCriacao                    = DateTime.Now;
            faturaTitulo.DataUltimaModificacao          = DateTime.Now;
            faturaTitulo.GuidReferencia                 = Guid.NewGuid();
            faturaTitulo.NumeroFatura                   = tituloReceber.NumeroTitulo + "/" + (i + 1).ToString("D2");
            faturaTitulo.Valor                          = tituloReceber.ValorTitulo;
            faturaTitulo.DataVencimento                 = new DateTime(dataVencimento.Year, dataVencimento.Month, diaVencimento);

            lstFaturaTitulo.Add(faturaTitulo);
        }
        return lstFaturaTitulo;
    }

    private static void BindTituloReceberReajusteData(ContratoAluguel contratoAluguel, TituloReceber tituloReceber, List<FaturaTitulo> lstFaturaTitulo)
    {
        DateTime dataVencimento = tituloReceber.DataFimTitulo.Value.AddMonths(12);
        tituloReceber.DataUltimaModificacao = DateTime.Now;
        tituloReceber.DataFimTitulo = tituloReceber.DataFimTitulo.Value >= dataVencimento ? tituloReceber.DataFimTitulo : dataVencimento;
        
        tituloReceber.ValorTitulo = contratoAluguel.ValorAluguelLiquido;
        tituloReceber.ValorTotalTitulo = (tituloReceber.ValorTotalTitulo + (contratoAluguel.ValorAluguelLiquido * 12));
        tituloReceber.Parcelas = tituloReceber.Parcelas + 12;
        tituloReceber.PorcentagemTaxaAdministracao = contratoAluguel.PercentualRetencaoImpostos;

        BindFaturaTituloReajusteData(tituloReceber, lstFaturaTitulo);
    }

    private static List<FaturaTitulo> BindFaturaTituloReajusteData(TituloReceber tituloReceber, List<FaturaTitulo> lstFaturaTitulo)
    {
        for (int i = 12; i < 24; i++)
        {
            int diaVencimento = tituloReceber.DataVencimentoPrimeraParcela.Value.Day;
            DateTime dataVencimento = tituloReceber.DataVencimentoPrimeraParcela.Value.AddMonths(i);

            FaturaTitulo faturaTitulo = new FaturaTitulo();
            faturaTitulo.IdTitulo = tituloReceber.Id;
            faturaTitulo.NumeroParcela = i+1;
            faturaTitulo.Status = true;
            faturaTitulo.StatusFatura = FaturaTituloEnum.A_VENCER;
            faturaTitulo.DataCriacao = DateTime.Now;
            faturaTitulo.DataUltimaModificacao = DateTime.Now;
            faturaTitulo.GuidReferencia = Guid.NewGuid();
            faturaTitulo.NumeroFatura = tituloReceber.NumeroTitulo + "/" + (i + 1).ToString("D2");
            faturaTitulo.Valor = tituloReceber.ValorTitulo;
            faturaTitulo.DataVencimento = new DateTime(dataVencimento.Year, dataVencimento.Month, dataVencimento.Day);

            lstFaturaTitulo.Add(faturaTitulo);
        }
        return lstFaturaTitulo;
    }

    private static double calcularPorcentagem(double valor, double percentual)
    {
        if(percentual == 0)
            return valor;
        else
            return (percentual / 100.0) * valor;
    }

    private static double calcularValorComDesconto(double ValorTitulo, double percentual)
    {
        return calcularPorcentagem(ValorTitulo, percentual);
    }
}