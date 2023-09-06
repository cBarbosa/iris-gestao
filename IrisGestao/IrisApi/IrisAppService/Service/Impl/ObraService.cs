using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ObraService: IObraService
{
    private readonly IObraRepository obraRepository;
    private readonly INotaFiscalRepository notaFiscalRepository;
    private readonly IUnidadeRepository unidaderepository;
    private readonly IImovelRepository imovelRepository;
    private readonly ILogger<IObraService> logger;
    
    public ObraService(
        IObraRepository obraRepository
        , INotaFiscalRepository notaFiscalRepository
        , IUnidadeRepository unidaderepository
        , IImovelRepository imovelRepository
        , ILogger<IObraService> logger)
    {
        this.obraRepository = obraRepository;
        this.notaFiscalRepository = notaFiscalRepository;
        this.unidaderepository = unidaderepository;
        this.imovelRepository = imovelRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(
        int? idCategoria,
        int? idProprietario,
        string? nome,
        int limit,
        int page)
    {
        var result = await obraRepository.GetAllPaging(idCategoria, idProprietario, nome, limit, page);

        return result == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
    }

    public async Task<CommandResult> GetByReferenceGuid(Guid uuid)
    {
        var obra = await obraRepository.GetByReferenceGuid(uuid);

        return obra == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, obra);
    }

    public async Task<CommandResult> Insert(CriarObraCommand cmd)
    {
        var obra = new Obra();
        cmd.GuidReferencia = null;
        
        try
        {
            BindObraData(cmd, ref obra);

            var imovel = await imovelRepository.GetByReferenceGuid(cmd.ImovelGuidReference.Value);
            
            obra.IdImovel = imovel.Id;
            obra.IdOrcamentoNavigation = new Orcamento
            {
                ValorEstimado = cmd.ValorOrcamento ?? 0,
                ValorContratado = cmd.ValorOrcamento ?? 0,
                IdTipoServico = 1
            };
            
            obraRepository.Insert(obra);

            await InsereUnidades(obra.Id, cmd.UnidadeGuidReferences);
            
            return new CommandResult(true, SuccessResponseEnums.Success_1000, obra);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarObraCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var obra = await obraRepository.GetByGuid(uuid);
        
        if (obra == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        
        cmd.GuidReferencia = uuid;

        try
        {
            BindObraData(cmd, ref obra);
            obraRepository.Update(obra);

            return new CommandResult(true, SuccessResponseEnums.Success_1001, obra);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> InsertNotaFiscal(Guid uuid, CriarObraNotaFiscalCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var obra = await obraRepository.GetByGuid(uuid);
        
        if (obra == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        try
        {
            var notaFiscal = new NotaFiscal
            {
                GuidReferencia = Guid.NewGuid(),
                IdObra = obra.Id,
                IdTipoServico = cmd.IdTipoServico,
                NumeroNota = cmd.NumeroNota,
                DataEmissao = cmd.DataEmissao,
                ValorServico = cmd.ValorServico,
                ValorOrcado = cmd.ValorOrcado,
                ValorContratado = cmd.ValorContratado,
                PercentualAdministracaoObra = cmd.Percentual,
                DataVencimento = cmd.DataVencimento
            };
            notaFiscalRepository.Insert(notaFiscal);
        
            return new CommandResult(true, SuccessResponseEnums.Success_1000, notaFiscal);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> GetNotaFiscalByGuid(Guid uuid)
    {
        var notaFiscal = await notaFiscalRepository.GetByReferenceGuid(uuid);

        return notaFiscal == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, notaFiscal);
    }

    public async Task<CommandResult> UpdateNotaFiscal(Guid uuid, CriarObraNotaFiscalCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var notaFiscal = await notaFiscalRepository.GetByGuid(uuid);
        
        if (notaFiscal == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        try
        {
            notaFiscal.IdTipoServico = cmd.IdTipoServico;
            notaFiscal.NumeroNota = cmd.NumeroNota;
            notaFiscal.DataEmissao = cmd.DataEmissao;
            notaFiscal.ValorServico = cmd.ValorServico;
            notaFiscal.ValorOrcado = cmd.ValorOrcado;
            notaFiscal.ValorContratado = cmd.ValorContratado;
            notaFiscal.PercentualAdministracaoObra = cmd.Percentual;
            notaFiscal.DataVencimento = cmd.DataVencimento;

            return new CommandResult(true, SuccessResponseEnums.Success_1001, notaFiscal);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    private static void BindObraData(CriarObraCommand cmd, ref Obra obra)
    {
        switch (obra.GuidReferencia)
        {
            case null:
                obra.GuidReferencia = Guid.NewGuid();
                break;
            default:
                obra.DataUltimaModificacao = DateTime.Now;
                break;
        }

        obra.Nome = cmd.Nome;
        obra.Percentual = cmd.Percentual;
        obra.ValorOrcamento = cmd.ValorOrcamento;
        obra.DataInicio = cmd.DataInicio;
        obra.DataPrevistaTermino = cmd.DataPrevistaTermino;
    }

    private async Task InsereUnidades(int obraId, IEnumerable<Guid> Guids)
    {
        foreach (var item in Guids)
        {
            var unit = await unidaderepository.GetByReferenceGuid(item);
            if(unit == null)
                continue;

            await obraRepository.InsertObraUnidade(
                new ObraUnidade
                    {
                        IdObra = obraId,
                        IdUnidade = unit.Id
                    });
        }
    }
}