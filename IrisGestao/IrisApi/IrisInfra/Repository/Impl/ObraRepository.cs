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
                    .Include(x => x.NotaFiscal)
                    .Select(x => new
                    {
                        x.GuidReferencia,
                        x.Nome,
                        x.DataInicio,
                        x.DataPrevistaTermino,
                        x.Percentual,
                        x.ValorOrcamento,
                        Imovel = new
                        {
                            x.IdImovelNavigation.GuidReferencia,
                            x.IdImovelNavigation.Nome
                        },
                        NotasFiscais = x.NotaFiscal
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
            .SingleOrDefaultAsync(x => x.GuidReferencia.Equals(uuid));
    }

    public async Task<object?> GetByReferenceGuid(Guid uuid)
    {
        return await DbSet
            .Include(x => x.IdImovelNavigation)
            .Include(x => x.NotaFiscal)
            .ThenInclude(x => x.IdTipoServicoNavigation)
            .Where(x => x.GuidReferencia.Equals(uuid))
            .Select(x => new
            {
                x.GuidReferencia,
                x.Nome,
                x.DataInicio,
                x.DataPrevistaTermino,
                x.Percentual,
                x.ValorOrcamento,
                Imovel = new
                {
                    x.IdImovelNavigation.GuidReferencia,
                    x.IdImovelNavigation.Nome
                },
                NotasFiscais = x.NotaFiscal
            })
            .ToListAsync();
    }
}