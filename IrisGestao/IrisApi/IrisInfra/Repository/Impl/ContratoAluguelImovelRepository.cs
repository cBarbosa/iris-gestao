using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace IrisGestao.Infraestructure.Repository.Impl;
public class ContratoAluguelImovelRepository : Repository<ContratoAluguelImovel>, IContratoAluguelImovelRepository
{
    public ContratoAluguelImovelRepository(IConfiguration configuration, ILogger<ContratoAluguelImovel> logger)
        : base(configuration, logger)
    {

    }

    public async Task<IEnumerable<ContratoAluguelImovel>> GetContratoImoveisByContrato(int idContratoAluguel)
    {
        return await DbSet
            .Where(x => x.IdContratoAluguel.Equals(idContratoAluguel))
            .ToListAsync();
    }
    public async Task<IEnumerable<Object>> getAllImoveisDoContrato()
    {
        return await DbSet
            .Include(x=> x.IdImovelNavigation)
                .ThenInclude(x=> x.Unidade)
            .ToListAsync();
    }
}
