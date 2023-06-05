using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;
using System.ComponentModel;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContratoAluguelService: IContratoAluguelService
{
    private readonly IContratoAluguelRepository contratoAluguelRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly IUnidadeRepository unidadeRepository;
    private readonly IClienteRepository clienteRepository;
    private readonly IContratoAluguelImovelRepository contratoAluguelImovelRepository;
    private readonly IContratoAluguelUnidadeRepository contratoAluguelUnidadeRepository;
    private readonly ITituloReceberService tituloReceberService;
    private readonly ITituloPagarService tituloPagarService;
    private readonly IContratoAluguelHistoricorReajusteService contratoAluguelHistoricorReajusteService;
    private readonly ILogger<IContratoAluguelService> logger;

    public ContratoAluguelService(IContratoAluguelRepository ContratoAluguelRepository
                        , IImovelRepository ImovelRepository
                        , IUnidadeRepository UnidadeRepository
                        , IClienteRepository ClienteRepository
                        , IContratoAluguelImovelRepository ContratoAluguelImovelRepository
                        , IContratoAluguelUnidadeRepository ContratoAluguelUnidadeRepository
                        , ITituloReceberService TituloReceberService
                        , ITituloPagarService TituloPagarService
                        , IContratoAluguelHistoricorReajusteService contratoAluguelHistoricorReajusteService
                        , ILogger<IContratoAluguelService> logger)
    {
        this.contratoAluguelRepository = ContratoAluguelRepository;
        this.imovelRepository = ImovelRepository;
        this.unidadeRepository = UnidadeRepository;
        this.clienteRepository = ClienteRepository;
        this.contratoAluguelImovelRepository = ContratoAluguelImovelRepository;
        this.contratoAluguelUnidadeRepository = ContratoAluguelUnidadeRepository;
        this.tituloReceberService = TituloReceberService; 
        this.tituloPagarService = TituloPagarService;
        this.contratoAluguelHistoricorReajusteService = contratoAluguelHistoricorReajusteService;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(int? idTipoImovel, int? idBaseReajuste, DateTime? dthInicioVigencia, DateTime? dthFimVigencia, string? numeroContrato, int limit, int page)
    {
        /*if(dthInicioVigencia.HasValue && dthFimVigencia.HasValue)
        {
            var diffDatas = dthFimVigencia.Value - dthInicioVigencia.Value;
            if(diffDatas.Days < 1 || diffDatas.Days > 30)
            {
                return new CommandResult(false, String.Format(ErrorResponseEnums.Error_1008,30), null!);
            }
        }*/
        
        var result = await contratoAluguelRepository.GetAllPaging(idTipoImovel, idBaseReajuste, dthInicioVigencia, dthFimVigencia, numeroContrato, limit, page);

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

        var ContratoAluguel = await contratoAluguelRepository.GetByContratoAluguelGuid(guid);

        return ContratoAluguel == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, ContratoAluguel);
    }

    public async Task<CommandResult> Insert(CriarContratoAluguelCommand cmd)
    {
        var contratoAluguel = new ContratoAluguel();
        var cliente = await clienteRepository.GetByReferenceGuid(cmd.GuidCliente);

        String validacao = validarDados(cmd);

        if (!String.IsNullOrEmpty(validacao))
        {
            return new CommandResult(false, validacao, null!);
        }

        BindContratoAluguelData(cmd, contratoAluguel);
        contratoAluguel.IdCliente = cliente.Id;

        try
        {
            contratoAluguelRepository.Insert(contratoAluguel);
            await CriaContratoAluguelImovel(contratoAluguel.Id, cmd.lstImoveis);

            //Criar Titulos Contas a Receber - Receitas
            await tituloReceberService.InsertByContratoAluguel(contratoAluguel, cmd.lstImoveis);

            //Criar Titulos Contas a Pagar - Despesas
            await tituloPagarService.InsertByContratoAluguel(contratoAluguel, cmd.lstImoveis);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, contratoAluguel);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarContratoAluguelCommand cmd)
    {
        var contratoAluguel = new ContratoAluguel();
        
        String validacao = validarDados(cmd);

        if (!String.IsNullOrEmpty(validacao))
        {
            return new CommandResult(false, validacao, null!);
        }
        contratoAluguel = await contratoAluguelRepository.GetByGuid(uuid);
        if (contratoAluguel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Contrato", null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.GuidCliente);
        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }

        BindContratoAluguelData(cmd, contratoAluguel);
        contratoAluguel.IdCliente = cliente.Id;

        try
        {

            contratoAluguelRepository.Update(contratoAluguel);
            List<ContratoAluguelImovel> lstContratosVinculados = new List<ContratoAluguelImovel>();
            /*var contratosVinculados = await contratoAluguelImovelRepository.GetContratoImoveisByContrato(contratoAluguel.Id);
            lstContratosVinculados = contratosVinculados.ToList();
            await AtualizaContratoAluguelImovel(contratoAluguel.Id, cmd.lstImoveis, lstContratosVinculados);
            */
            return new CommandResult(true, SuccessResponseEnums.Success_1001, contratoAluguel);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> AlterarStatus(Guid uuid, bool status)
    {
        if (uuid.Equals(Guid.Empty)){
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var ContratoAluguel = await contratoAluguelRepository.GetByGuid(uuid);

        if (ContratoAluguel == null){
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        if (!status){
            ContratoAluguel.DataFimContrato = DateTime.Now; 
        }
        ContratoAluguel.Status = status;

        try
        {
            contratoAluguelRepository.Update(ContratoAluguel);
            await tituloReceberService.InativarTitulo(ContratoAluguel);
            await tituloPagarService.InativarTitulo(ContratoAluguel);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, ContratoAluguel);
        }
        catch (Exception e){
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> ReajusteContrato(Guid uuid, double novoPercentualReajuste)
    {
        if (uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var contratoAluguel = await contratoAluguelRepository.GetByGuid(uuid);

        if (contratoAluguel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        ContratoAluguelHistoricoReajusteCommand contratoAluguelHistoricoReajusteCommand = new ContratoAluguelHistoricoReajusteCommand();
        BindContratoAluguelHistoricoReajusteData(novoPercentualReajuste, contratoAluguelHistoricoReajusteCommand, contratoAluguel);

        try
        {
            contratoAluguelRepository.Update(contratoAluguel);
            contratoAluguelHistoricorReajusteService.Insert(contratoAluguelHistoricoReajusteCommand);
            await tituloReceberService.AtualizarReajuste(contratoAluguel);
            await tituloPagarService.AtualizarReajuste(contratoAluguel);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, contratoAluguel);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }
    
    public async Task<CommandResult> GetDashbaordFinancialVacancy(
        DateTime DateRefInit,
        DateTime DateRefEnd,
        int? IdLocador, int? IdTipoImovel)
    {
        var rnd = new Random();
        var result = new object[]
        {
            new { referencia = "Janeiro", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Fevereiro", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Março", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Abril", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Maio", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Junho", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Julho", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Agosto", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Setembro", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Outubro", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Novembro", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) },
            new { referencia = "Dezembro", contratada = rnd.Next(1, 50), potencial = rnd.Next(50, 100), financeira = rnd.Next(40, 80) }
        };

        return await Task.FromResult(new CommandResult(true, SuccessResponseEnums.Success_1005, result));
    }

    public async Task<CommandResult> GetDashboardTotalManagedArea(
        DateTime DateRefInit,
        DateTime DateRefEnd,
        int? IdLocador, int? IdTipoImovel)
    {
        var rnd = new Random();
        var result = new object[]
        {
            new { title = "Coorporativo CNC", percent = Math.Round(rnd.NextDouble() * (30.0 - 10.0) + 30.0, 2), color = $"#{rnd.Next(0x1000000):X6}"},
            new { title = "Coorporativo Stylos", percent = Math.Round(rnd.NextDouble() * (20.0 - 10.0) + 20.0, 2), color = $"#{rnd.Next(0x1000000):X6}"},
            new { title = "Varejo CNC", percent = Math.Round(rnd.NextDouble() * (30.0 - 10.0) + 30.0, 2), color = $"#{rnd.Next(0x1000000):X6}"},
            new { title = "Varejo CNC 2", percent = Math.Round(rnd.NextDouble() * (20.0 - 10.0) + 20.0, 2), color = $"#{rnd.Next(0x1000000):X6}"}
        };

        return await Task.FromResult(new CommandResult(true, SuccessResponseEnums.Success_1005, result));
    }

    private async Task CriaContratoAluguelImovel(int idContratoAluguel, List<ContratoAluguelImovelCommand> lstContratoImovel)
    {
        foreach (ContratoAluguelImovelCommand contratoImovel in lstContratoImovel)
        { 
            var contratoAluguelImovel = new ContratoAluguelImovel();
            contratoAluguelImovel.IdContratoAluguel = idContratoAluguel;

            var imovel = await imovelRepository.GetByReferenceGuid(contratoImovel.guidImovel);

            if (imovel != null)
            {
                contratoAluguelImovel.IdImovel = imovel.Id;
            }
            contratoAluguelImovelRepository.Insert(contratoAluguelImovel);
            await CriaContratoAluguelUnidades(contratoAluguelImovel.Id, contratoImovel.lstUnidades);
        }
    }

    private async Task CriaContratoAluguelUnidades(int idContratoImovel, List<Guid> lstContratoUnidades)
    {
        foreach (Guid unidadeContrato in lstContratoUnidades)
        {
            var contratoAluguelUnidade = new ContratoAluguelUnidade();
            contratoAluguelUnidade.IdContratoAluguelImovel = idContratoImovel;

            Unidade unidade = await unidadeRepository.GetByReferenceGuid(unidadeContrato);

            if (unidade != null)
            {
                contratoAluguelUnidade.IdUnidade = unidade.Id;
            }
            contratoAluguelUnidadeRepository.Insert(contratoAluguelUnidade);
        }
    }

    private async Task AtualizaContratoAluguelImovel(int idContratoAluguel, List<ContratoAluguelImovelCommand> lstContratoImovel, List<ContratoAluguelImovel> lstImoveisVinculados)
    {
        List<ContratoAluguelImovel> lstContratoAluguelImovel = new List<ContratoAluguelImovel>();
        foreach (ContratoAluguelImovelCommand contratoImovel in lstContratoImovel)
        {
            var imovel = await imovelRepository.GetByReferenceGuid(contratoImovel.guidImovel);

            ContratoAluguelImovel _contratoAluguelImovel = new ContratoAluguelImovel();
            _contratoAluguelImovel.IdImovel = imovel.Id;
            _contratoAluguelImovel.IdContratoAluguel = idContratoAluguel;
            lstContratoAluguelImovel.Add(_contratoAluguelImovel);
        }
        var list3 = lstImoveisVinculados.Except(lstContratoAluguelImovel).ToList();
        var list4 = lstContratoAluguelImovel.Except(lstImoveisVinculados).ToList();
    }
    private static void BindContratoAluguelData(CriarContratoAluguelCommand cmd, ContratoAluguel ContratoAluguel)
    {
        double valorLiquido;

        valorLiquido = calculaValorLiquido(cmd.ValorAluguel, cmd.PercentualDescontoAluguel, cmd.PercentualRetencaoImpostos);

        switch (ContratoAluguel.GuidReferencia)
        {
            case null:
                ContratoAluguel.GuidReferencia = Guid.NewGuid();
                ContratoAluguel.DataCriacao = DateTime.Now;
                ContratoAluguel.DataUltimaModificacao = DateTime.Now;
                break;
            default:
                ContratoAluguel.GuidReferencia = ContratoAluguel.GuidReferencia;
                ContratoAluguel.DataUltimaModificacao = DateTime.Now;
                break;
        }
        ContratoAluguel.IdCliente                       = ContratoAluguel.Id;
        ContratoAluguel.IdTipoCreditoAluguel            = cmd.IdTipoCreditoAluguel;
        ContratoAluguel.IdIndiceReajuste                = cmd.IdIndiceReajuste;
        ContratoAluguel.IdTipoContrato                  = cmd.IdTipoContrato;
        ContratoAluguel.NumeroContrato                  = cmd.NumeroContrato;
        ContratoAluguel.ValorAluguel                    = cmd.ValorAluguel;
        ContratoAluguel.PercentualRetencaoImpostos      = cmd.PercentualRetencaoImpostos;
        ContratoAluguel.ValorAluguelLiquido             = valorLiquido;
        ContratoAluguel.PercentualDescontoAluguel       = cmd.PercentualDescontoAluguel;
        ContratoAluguel.CarenciaAluguel                 = cmd.CarenciaAluguel;
        ContratoAluguel.PrazoCarencia                   = cmd.PrazoCarencia;
        ContratoAluguel.DataInicioContrato              = cmd.DataInicioContrato;
        ContratoAluguel.PrazoTotalContrato              = cmd.PrazoTotalContrato;
        ContratoAluguel.DataFimContrato                 = cmd.DataInicioContrato.AddMonths(cmd.PrazoTotalContrato);
        ContratoAluguel.DataOcupacao                    = cmd.DataOcupacao;
        ContratoAluguel.DiaVencimentoAluguel            = cmd.DataVencimentoPrimeraParcela.Value.Day;
        ContratoAluguel.PeriodicidadeReajuste           = cmd.PeriodicidadeReajuste;
        ContratoAluguel.DataVencimentoPrimeraParcela    = cmd.DataVencimentoPrimeraParcela;
        ContratoAluguel.Status                          = true;
    }

    private static void BindContratoAluguelHistoricoReajusteData(double novoPercentualReajuste, ContratoAluguelHistoricoReajusteCommand cmd, ContratoAluguel ContratoAluguel)
    {
        double valorLiquido;
        valorLiquido = calculaValorLiquido(ContratoAluguel.ValorAluguel, ContratoAluguel.PercentualDescontoAluguel, novoPercentualReajuste);
        DateTime dataVencimento                     = ContratoAluguel.DataFimContrato.AddMonths(12);

        cmd.IdContratoAluguel                       = ContratoAluguel.Id;
        cmd.PercentualReajusteAntigo                = ContratoAluguel.PercentualRetencaoImpostos;
        cmd.PercentualReajusteNovo                  = novoPercentualReajuste;
        cmd.ValorAluguelAnterior                    = ContratoAluguel.ValorAluguelLiquido;
        cmd.ValorAluguelNovo                        = valorLiquido;

        ContratoAluguel.DataUltimaModificacao       = DateTime.Now;
        ContratoAluguel.PercentualRetencaoImpostos  = novoPercentualReajuste;
        ContratoAluguel.ValorAluguelLiquido         = valorLiquido;
        ContratoAluguel.DataFimContrato             = ContratoAluguel.DataFimContrato >= dataVencimento ? ContratoAluguel.DataFimContrato : dataVencimento;
    }

    protected String validarDados(CriarContratoAluguelCommand cmd) 
    { 
        var contratoAluguel = new ContratoAluguel(); 
        string msgRetorno = string.Empty;

        if (cmd?.DataOcupacao.Value > cmd?.DataInicioContrato.AddMonths(cmd.PrazoTotalContrato))
            msgRetorno += "A data de ocupação do imóvel não pode ser maior que a data fim do contrato";

        if (cmd?.DataOcupacao.Value < cmd?.DataInicioContrato)
            msgRetorno += "A data de ocupação do imóvel não pode ser menor que a data de início do contrato";

        if (cmd?.PeriodicidadeReajuste > cmd?.PrazoTotalContrato)
            msgRetorno += "A periodicidade de reajuste não pode ser maior que o prazo total do contrato";

        return msgRetorno;
    }

    private static double calculaValorLiquido(double valorAluguel, double? percentualDesconto, double percentualImpostos)
    {
        double valorComDesconto = valorAluguel;
        double valorImpostos;
        double valorComImpostos;
        double valorDescontos = 0;

        if (percentualDesconto.HasValue)
        {
            valorDescontos = calcularPorcentagem(valorAluguel, percentualDesconto.Value);
            valorComDesconto = valorAluguel - valorDescontos;
        }

        valorImpostos = calcularPorcentagem(valorComDesconto, percentualImpostos);

        return valorComDesconto - valorImpostos;
    }

    private static double calcularPorcentagem(double valor, double percentual)
    {
        return (percentual / 100.0) * valor;
    }
}