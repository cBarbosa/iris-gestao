using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class UnidadeRepository : Repository<Unidade>, IUnidadeRepository
{
    public UnidadeRepository(IConfiguration configuration, ILogger<Unidade> logger)
        : base(configuration, logger)
    {
    }

    public IEnumerable<Unidade> GetById(int codigo)
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoUnidadeNavigation)
                                .Where(x => x.Id == codigo).ToList();

        return lstUnidades.AsEnumerable();
    }

    public IEnumerable<Unidade> GetAll()
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoUnidadeNavigation).ToList();

        return lstUnidades.AsEnumerable();
    }
    public IEnumerable<Unidade> BuscarUnidadePorImovel(int codigoImovel)
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoUnidadeNavigation)
                                .Where(x => x.IdImovel == codigoImovel).ToList();

        return lstUnidades.AsEnumerable();
    }
}