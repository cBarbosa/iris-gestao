using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class FaturaTituloRepository : Repository<FaturaTitulo>, IFaturaTituloRepository
{
    public FaturaTituloRepository(IConfiguration configuration, ILogger<FaturaTitulo> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<FaturaTitulo?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }
}