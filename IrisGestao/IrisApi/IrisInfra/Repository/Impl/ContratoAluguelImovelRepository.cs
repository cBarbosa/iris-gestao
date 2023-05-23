using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

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
}
