using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContratoAluguelService: IContratoAluguelService
{
    private readonly IContratoAluguelRepository contratoAluguelRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly IUnidadeRepository unidadeRepository;
    private readonly IClienteRepository clienteRepository;
    private readonly IContratoAluguelImovelRepository contratoAluguelImovelRepository;
    private readonly IContratoAluguelUnidadeRepository contratoAluguelUnidadeRepository;
    private readonly ILogger<IContratoAluguelService> logger;

    public ContratoAluguelService(IContratoAluguelRepository ContratoAluguelRepository
                        , IImovelRepository ImovelRepository
                        , IUnidadeRepository UnidadeRepository
                        , IClienteRepository ClienteRepository
                        , IContratoAluguelImovelRepository ContratoAluguelImovelRepository
                        , IContratoAluguelUnidadeRepository ContratoAluguelUnidadeRepository
                        , ILogger<IContratoAluguelService> logger)
    {
        this.contratoAluguelRepository = ContratoAluguelRepository;
        this.imovelRepository = ImovelRepository;
        this.unidadeRepository = UnidadeRepository;
        this.clienteRepository = ClienteRepository;
        this.contratoAluguelImovelRepository = ContratoAluguelImovelRepository;
        this.contratoAluguelUnidadeRepository = ContratoAluguelUnidadeRepository;
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
        if (cmd.GuidCliente.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.GuidCliente);
        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }
        BindContratoAluguelData(cmd, contratoAluguel);
        contratoAluguel.IdCliente = cliente.Id;

        if(contratoAluguel.DataOcupacao.Value > contratoAluguel.DataFimContrato)
        {
            return new CommandResult(false, "A data de ocupação do imóvel não pode ser maior que a data fim do contrato", null!);
        }
        if (contratoAluguel.PeriodicidadeReajuste > contratoAluguel.PrazoTotalContrato)
        {
            return new CommandResult(false, "A periodicidade de reajuste não pode ser maior que o prazo total do contrato", null!);
        }

        try
        {
            contratoAluguelRepository.Insert(contratoAluguel);
            await CriaContratoAluguelImovel(contratoAluguel.Id, cmd.lstImoveis);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, contratoAluguel);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
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
            return new CommandResult(true, SuccessResponseEnums.Success_1001, ContratoAluguel);
        }
        catch (Exception e){
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
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
        ContratoAluguel.IdCliente                   = ContratoAluguel.Id;
        ContratoAluguel.IdTipoCreditoAluguel        = cmd.IdTipoCreditoAluguel;
        ContratoAluguel.IdIndiceReajuste            = cmd.IdIndiceReajuste;
        ContratoAluguel.IdTipoContrato              = cmd.IdTipoContrato;
        ContratoAluguel.NumeroContrato              = cmd.NumeroContrato;
        ContratoAluguel.ValorAluguel                = cmd.ValorAluguel;
        ContratoAluguel.PercentualRetencaoImpostos  = cmd.PercentualRetencaoImpostos;
        ContratoAluguel.ValorAluguelLiquido         = valorLiquido;
        ContratoAluguel.PercentualDescontoAluguel   = cmd.PercentualDescontoAluguel;
        ContratoAluguel.CarenciaAluguel             = cmd.CarenciaAluguel;
        ContratoAluguel.PrazoCarencia               = cmd.PrazoCarencia;
        ContratoAluguel.DataInicioContrato          = cmd.DataInicioContrato;
        ContratoAluguel.PrazoTotalContrato          = cmd.PrazoTotalContrato;
        ContratoAluguel.DataFimContrato             = cmd.DataInicioContrato.AddMonths(cmd.PrazoTotalContrato);
        ContratoAluguel.DataOcupacao                = cmd.DataOcupacao;
        ContratoAluguel.DiaVencimentoAluguel        = cmd.DiaVencimentoAluguel;
        ContratoAluguel.PeriodicidadeReajuste       = cmd.PeriodicidadeReajuste;
        ContratoAluguel.Status                      = true;
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

        valorImpostos = calcularPorcentagem(valorAluguel, percentualImpostos);

        return valorComDesconto + valorImpostos;
    }

    private static double calcularPorcentagem(double valor, double percentual)
    {
        return (percentual / 100.0) * valor;
    }
}