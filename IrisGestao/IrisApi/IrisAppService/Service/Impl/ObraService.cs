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
    private readonly IUnidadeRepository unidaderepository;
    private readonly IImovelRepository imovelRepository;
    private readonly ILogger<IObraService> logger;
    
    public ObraService(
        IObraRepository obraRepository
        , IUnidadeRepository unidaderepository
        , IImovelRepository imovelRepository
        , ILogger<IObraService> logger)
    {
        this.obraRepository = obraRepository;
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

            await RemoveAllUnits(obra.ObraUnidade.Count, obra);

            obraRepository.Update(obra);

            await InsereUnidades(obra.Id, cmd.UnidadeGuidReferences);
            
            return new CommandResult(true, SuccessResponseEnums.Success_1001, obra);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> InsertServico(Guid guid, CriarObraServicoCommand cmd)
    {
        var obraServico = new ObraServico();
        
        try
        {
            BindObraServicoData(cmd, ref obraServico);

            var obra = await obraRepository.GetByGuid(guid);

            if (obra == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
            }

            obraServico.IdObra = obra.Id;
            obraServico.GuidReferencia = Guid.NewGuid();
            
            await obraRepository.InsertServico(obraServico);
            
            return new CommandResult(true, SuccessResponseEnums.Success_1000, obraServico);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> UpdateServico(Guid guid, CriarObraServicoCommand cmd)
    {
        if (cmd == null || guid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var obraServico = await obraRepository.GetServicoByGuid(guid);
        
        if (obraServico == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        try
        {
            BindObraServicoData(cmd, ref obraServico);

            await obraRepository.UpdateServico(obraServico);
            
            return new CommandResult(true, SuccessResponseEnums.Success_1001, obraServico);
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
        obra.PercentualAdministracao = cmd.PercentualAdministracao;
        obra.ValorOrcamento = cmd.ValorOrcamento;
        obra.DataInicio = cmd.DataInicio;
        obra.DataPrevistaTermino = cmd.DataPrevistaTermino;
    }

    private static void BindObraServicoData(
        CriarObraServicoCommand cmd,
        ref ObraServico obraServico)
    {
        obraServico.NumeroNota = cmd.NumeroNota;
        // obraServico.PercentualAdministracaoObra = cmd.Percentual.HasValue
        //     ? cmd.Percentual.Value
        //     : 0;
        obraServico.ValorOrcado = cmd.ValorOrcado;
        obraServico.ValorContratado = cmd.ValorContratado;
        obraServico.DataEmissao = cmd.DataEmissao;
        // obraServico.DataVencimento = cmd.DataVencimento;
        obraServico.Descricao = cmd.Descricao;
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
    
    private async Task RemoveAllUnits(int obraUnidadeCount, Obra obra)
    {
        for (var i = 0; i < obraUnidadeCount; i++)
        {
            var item = obra.ObraUnidade.First();
            await obraRepository.DeleteObraUnidade(item);
            obra.ObraUnidade.Remove(item);
        }
    }
}