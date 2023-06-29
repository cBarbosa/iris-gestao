using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

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
            .FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
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
                            Descricao = x.descricao,
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

}