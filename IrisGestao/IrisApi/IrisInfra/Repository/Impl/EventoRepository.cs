using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class EventoRepository: Repository<Evento>, IEventoRepository
{
    public EventoRepository(IConfiguration configuration, ILogger<Evento> logger)
        : base(configuration, logger)
    {
        
    }
    
    public IEnumerable<Evento> GetById(int codigo)
    {
        var lstImovel = DbSet.Include(x => x.IdClienteNavigation)
                                .Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoEventoNavigation)
                                .Where(x => x.Id == codigo).ToList();

        return lstImovel.AsEnumerable();
    }

    public async Task<Evento?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet
            .Include(x => x.EventoUnidade)
                .ThenInclude(x => x.IdUnidadeNavigation)
            .SingleOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<object?> GetByGuid(Guid guid)
    {
        return await DbSet
                        .Include(x => x.IdClienteNavigation)
                        .Include(x => x.EventoUnidade)
                            .ThenInclude(x => x.IdUnidadeNavigation)
                        .Where(x => x.GuidReferencia.Equals(guid))
                        .Select(x => new
                        {
                            GuidReferenciaEvento = x.GuidReferencia,
                            DataRealizacao = x.DthRealizacao.HasValue ? x.DthRealizacao.Value.ToString("dd/MM/yyyy") : "",
                            Nome = x.Nome,
                            Descricao = x.Descricao,
                            TipoEvento = x.TipoEvento,
                            ClienteVisitante = x.IdClienteNavigation == null
                                ? null
                                : new
                                {
                                    GuidReferenciaVisitante = x.IdClienteNavigation.GuidReferencia,
                                    Nome = x.IdClienteNavigation.Nome
                                },
                            UnidadesVisitadas = x.EventoUnidade.Select(y => new
                            {
                                GuidReferenciaUnidadeVisitada = y.IdUnidadeNavigation.GuidReferencia,
                                Tipo = y.IdUnidadeNavigation.Tipo
                            })
                        }).FirstOrDefaultAsync();
    }


    public IEnumerable<Evento> BuscarEventoPorIdImovel(int codigo)
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoEventoNavigation)
                                .Where(x => x.IdImovel == codigo).ToList();

        return lstUnidades.AsEnumerable();
    }

    public IEnumerable<Evento> BuscarEventoPorIdCliente(int codigo)
    {
        var lstUnidades = DbSet.Include(x => x.IdClienteNavigation)
                                .Include(x => x.IdTipoEventoNavigation)
                                .Where(x => x.IdCliente == codigo).ToList();

        return lstUnidades.AsEnumerable();
    }

    public async Task<CommandPagingResult?> GetAllPaging(int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var eventos = await DbSet
                        .Include(x => x.EventoUnidade)
                        .Include(x => x.IdTipoEventoNavigation)
                        .Select(x => new
                        {
                            GuidReferencia = x.GuidReferencia,
                            Nome = x.Nome,
                            DataRealizacao = x.DthRealizacao,
                            DataCriacao = x.DataCriacao,
                            Descricao = x.Descricao,
                            TipoEvento = x.IdTipoEventoNavigation == null ? null : new
                            {
                                Id = x.IdTipoEventoNavigation.Id,
                                Nome = x.IdTipoEventoNavigation.Nome
                            },
                            ClienteVisitante = x.IdClienteNavigation == null ? null : new
                            {
                                GuidReferenciaVisitante = x.IdClienteNavigation.GuidReferencia,
                                Nome = x.IdClienteNavigation.Nome
                            },
                            UnidadesVisitadas = x.EventoUnidade.Select(y => new
                            {
                                GuidReferenciaUnidadeVisitada = y.IdUnidadeNavigation.GuidReferencia,
                                Tipo = y.IdUnidadeNavigation.Tipo
                            })
                        })
                    .ToListAsync();

            var totalCount = eventos.Count();

            var eventosPaging = eventos.Skip(skip).Take(limit);

            if (eventosPaging.Any())
                return new CommandPagingResult(eventosPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message);
        }

        return null!;
    }

    public async Task<IEnumerable<dynamic>?> GetAllProperties()
    {
        var retorno = await DbSet
            .Include(x => x.IdImovelNavigation)
            .Where(x => x.IdImovelNavigation.Status)
            .Select(x => new
            {
                x.IdImovelNavigation.Id,
                x.IdImovelNavigation.Nome
            })
            .Distinct()
            .OrderBy(x => x.Nome)
            .ToListAsync();

        return retorno;
    }

    public async Task<IEnumerable<dynamic>?> GetAllRenters()
    {
        var retorno = await DbSet
            .Include(x => x.IdClienteNavigation)
            .Where(x => x.IdClienteNavigation.Status)
            .Select(x => new
            {
                x.IdClienteNavigation.GuidReferencia,
                x.IdClienteNavigation.Id,
                x.IdClienteNavigation.Nome
            })
            .Distinct()
            .OrderBy(x => x.Nome)
            .ToListAsync();

        return retorno;
    }
}