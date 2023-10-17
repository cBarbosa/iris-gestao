using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ObraRepository : Repository<Obra>, IObraRepository
{
    public ObraRepository(IConfiguration configuration, ILogger<Obra> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<CommandPagingResult?> GetAllPaging(
        int? idCategoria,
        int? idProprietario,
        string? nome,
        int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var obras = await DbSet
                    .Include(x => x.IdImovelNavigation)
                    .Select(x => new
                    {
                        x.GuidReferencia,
                        x.Nome,
                        x.DataInicio,
                        x.DataPrevistaTermino,
                        x.Percentual,
                        x.PercentualAdministracao,
                        x.ValorOrcamento,
                        Imovel = new
                        {
                            x.IdImovelNavigation.GuidReferencia,
                            x.IdImovelNavigation.Nome
                        }
                    })
                    .ToListAsync();

            var totalCount = obras.Count();

            var obrasPaging = obras.Skip(skip).Take(limit);

            if (obrasPaging.Any())
                return new CommandPagingResult(obrasPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, ex.Message);
        }

        return null!;
    }

    public async Task<Obra?> GetByGuid(Guid uuid)
    {
        return await DbSet
            .Include(x => x.ObraUnidade)
            .ThenInclude(x => x.IdUnidadeNavigation)
            .SingleOrDefaultAsync(x => x.GuidReferencia.Equals(uuid));
    }

    public async Task<object?> GetByReferenceGuid(Guid uuid)
    {
        return await DbSet
            .Include(x => x.IdImovelNavigation)
            .ThenInclude(x => x.IdCategoriaImovelNavigation)
            .Include(x => x.IdImovelNavigation.ImovelEndereco)
            .Include(x => x.ObraUnidade)
            .ThenInclude(x => x.IdUnidadeNavigation)
            .ThenInclude(x => x.IdTipoUnidadeNavigation)
            .Include(x => x.ObraServico)
            .Where(x => x.GuidReferencia.Equals(uuid))
            .Select(x => new
            {
                x.GuidReferencia,
                x.Nome,
                x.DataInicio,
                x.DataPrevistaTermino,
                x.Percentual,
                x.PercentualAdministracao,
                x.ValorOrcamento,
                Imovel = new
                {
                    x.IdImovelNavigation.GuidReferencia,
                    x.IdImovelNavigation.Nome,
                    x.IdImovelNavigation.ImovelEndereco,
                    x.IdImovelNavigation.IdCategoriaImovelNavigation
                },
                Unidades = x.ObraUnidade.Select(x =>
                    new
                    {
                        x.IdUnidadeNavigation.GuidReferencia,
                        x.IdUnidadeNavigation.Tipo,
                        x.IdUnidadeNavigation.IdTipoUnidadeNavigation
                    }),
                Servicos = x.ObraServico.Select(x => new
                    {
                        x.GuidReferencia,
                        x.NumeroNota,
                        x.ValorServico,
                        x.PercentualAdministracaoObra,
                        x.ValorOrcado,
                        x.ValorContratado,
                        x.DataEmissao,
                        x.DataVencimento,
                        x.DataCriacao,
                        x.Descricao
                    })
            })
            .SingleOrDefaultAsync();
    }
    
    public async Task<int?> InsertObraUnidade(ObraUnidade obraUnidade)
    {
        try
        {
            await Db.ObraUnidade.AddAsync(obraUnidade);
            return await Db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }

        return null;
    }

    public async Task<int?> DeleteObraUnidade(ObraUnidade obraUnidade)
    {
        var entity = await Db.ObraUnidade
            .SingleOrDefaultAsync(t => t.Id == obraUnidade.Id);
        
        try
        {
            Db.Remove(entity);
            return await Db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }

        return null;
    }

    public async Task<int?> InsertServico(ObraServico obraServico)
    {
        try
        {
            await Db.ObraServico.AddAsync(obraServico);
            return await Db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }

        return null;
    }

    public async Task<ObraServico?> GetServicoByGuid(Guid guid)
    {
        return await Db.ObraServico
            .SingleOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<int?> UpdateServico(ObraServico obraServico)
    {
        try
        {
            Db.Entry(obraServico).State = EntityState.Modified;
            Db.ObraServico.Update(obraServico);
            return await Db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }

        return null;
    }
}