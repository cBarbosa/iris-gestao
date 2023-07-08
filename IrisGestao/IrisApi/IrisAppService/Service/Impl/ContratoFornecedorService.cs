using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContratoFornecedorService: IContratoFornecedorService
{
    private readonly IContratoFornecedorRepository contratoFornecedorRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly IFornecedorRepository fornecedorRepository;
    private readonly IClienteRepository clienteRepository;
    private readonly IContratoAluguelImovelRepository contratoAluguelImovelRepository;
    private readonly IContratoAluguelUnidadeRepository contratoAluguelUnidadeRepository;
    private readonly ILogger<IContratoFornecedorService> logger;

    public ContratoFornecedorService(IContratoFornecedorRepository contratoFornecedorRepository
                        , IImovelRepository ImovelRepository
                        , IFornecedorRepository FornecedorRepository
                        , IClienteRepository ClienteRepository
                        , IContratoAluguelImovelRepository ContratoAluguelImovelRepository
                        , IContratoAluguelUnidadeRepository ContratoAluguelUnidadeRepository
                        , ILogger<IContratoFornecedorService> logger)
    {
        this.contratoFornecedorRepository = contratoFornecedorRepository;
        this.imovelRepository = ImovelRepository;
        this.fornecedorRepository = FornecedorRepository;
        this.clienteRepository = ClienteRepository;
        this.contratoAluguelImovelRepository = ContratoAluguelImovelRepository;
        this.contratoAluguelUnidadeRepository = ContratoAluguelUnidadeRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(string? numeroContrato, int limit, int page)
    {
        
        var result = await contratoFornecedorRepository.GetAllPaging(numeroContrato, limit, page);

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

        var ContratoFornecedor = await contratoFornecedorRepository.GetByContratoFornecedorGuid(guid);

        return ContratoFornecedor == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, ContratoFornecedor);
    }

    public async Task<CommandResult> Insert(CriarContratoFornecedorCommand cmd)
    {
        var contratoFornecedor = new ContratoFornecedor();
        if (cmd.GuidFornecedor.Equals(Guid.Empty) || cmd.GuidImovel.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var fornecedor = await fornecedorRepository.GetByReferenceGuid(cmd.GuidFornecedor.Value);
        if (fornecedor == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Imovel", null!);
        }

        var imovel = await imovelRepository.GetByReferenceGuid(cmd.GuidImovel.Value);
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }

        BindContratoFornecedorData(cmd, contratoFornecedor);
        contratoFornecedor.IdFornecedor = fornecedor.Id;
        contratoFornecedor.IdImovel = imovel.Id;

        try
        {
            contratoFornecedorRepository.Insert(contratoFornecedor);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, contratoFornecedor);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarContratoFornecedorCommand cmd)
    {
        var contratoFornecedor = new ContratoFornecedor();
        if (cmd == null || uuid.Equals(Guid.Empty)
            || cmd.GuidFornecedor.Equals(Guid.Empty) || cmd.GuidImovel.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var fornecedor = await fornecedorRepository.GetByReferenceGuid(cmd.GuidFornecedor.Value);
        if (fornecedor == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Imovel", null!);
        }

        var imovel = await imovelRepository.GetByReferenceGuid(cmd.GuidImovel.Value);
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }

        contratoFornecedor = await contratoFornecedorRepository.GetByGuid(uuid);
        if (contratoFornecedor == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Contrato", null!);
        }

        BindContratoFornecedorData(cmd, contratoFornecedor);
        contratoFornecedor.IdFornecedor = fornecedor.Id;
        contratoFornecedor.IdImovel = imovel.Id;

        try
        {
            contratoFornecedorRepository.Update(contratoFornecedor);

            return new CommandResult(true, SuccessResponseEnums.Success_1000, contratoFornecedor);
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

        var contratoFornecedor = await contratoFornecedorRepository.GetByGuid(uuid);

        if (contratoFornecedor == null){
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        if (!status){
            contratoFornecedor.DataFimContrato = DateTime.Now; 
        }
        contratoFornecedor.Status = status;

        try
        {
            contratoFornecedorRepository.Update(contratoFornecedor);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, contratoFornecedor);
        }
        catch (Exception e){
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }
    
    private static void BindContratoFornecedorData(CriarContratoFornecedorCommand cmd, ContratoFornecedor contratoFornecedor)
    {
        switch (contratoFornecedor.GuidReferencia)
        {
            case null:
                contratoFornecedor.GuidReferencia = Guid.NewGuid();
                contratoFornecedor.DataCriacao = DateTime.Now;
                contratoFornecedor.DataUltimaModificacao = DateTime.Now;
                break;
            default:
                contratoFornecedor.GuidReferencia = contratoFornecedor.GuidReferencia;
                contratoFornecedor.DataUltimaModificacao = DateTime.Now;
                break;
        }
        contratoFornecedor.NumeroContrato              = cmd.NumeroContrato;
        contratoFornecedor.IdFormaPagamento            = cmd.IdFormaPagamento;
        contratoFornecedor.IdIndiceReajuste            = cmd.IdIndiceReajuste;
        contratoFornecedor.DescricaoServico            = cmd.DescricaoDoServico;
        contratoFornecedor.Percentual                  = cmd.Percentual.HasValue ? cmd.Percentual.Value : null;
        contratoFornecedor.DataAtualizacao             = cmd.DataAtualizacao;
        contratoFornecedor.DataInicioContrato          = cmd.DataInicioContrato;
        contratoFornecedor.DataFimContrato             = cmd.DataFimContrato;
        contratoFornecedor.ValorServicoContratado      = cmd.ValorServicoContratado;
        contratoFornecedor.DiaPagamento                = cmd.DiaPagamento;
        contratoFornecedor.PeriodicidadeReajuste       = cmd.PeriodicidadeReajuste;
        contratoFornecedor.Status                      = true;
        contratoFornecedor.PrazoTotalMeses             = calculaMes(cmd.DataInicioContrato, cmd.DataFimContrato);

    }

    private static int calculaMes(DateTime dataInicio, DateTime dataFim)
    {
        return ((dataFim.Year - dataInicio.Year) * 12) + dataFim.Month - dataInicio.Month;
    }
}