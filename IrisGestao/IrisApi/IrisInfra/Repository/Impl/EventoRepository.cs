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
}