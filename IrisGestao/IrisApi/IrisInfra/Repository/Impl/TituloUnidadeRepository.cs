using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TituloUnidadeRepository : Repository<TituloUnidade>, ITituloUnidadeRepository
{
    public TituloUnidadeRepository(IConfiguration configuration, ILogger<TituloUnidade> logger)
        : base(configuration, logger)
    {

    }

    public IEnumerable<TituloUnidade> BuscarTituloUnidadeByImovelId(Guid uuid)
    {
        var lstUnidades = DbSet.Include(x => x.IdTituloImovelNavigation)
                                    .ThenInclude(y => y.IdImovel)
                                .Where(x => x.IdTituloImovelNavigation.IdTituloPagarNavigation.GuidReferencia.Equals(uuid)
                                && (x.IdTituloImovelNavigation.IdImovelNavigation.Status)).ToList();

        return lstUnidades.AsEnumerable();
    }
}