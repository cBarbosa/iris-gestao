using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoTituloRepository : Repository<TipoTitulo>, ITipoTituloRepository
{
    public TipoTituloRepository(IConfiguration configuration, ILogger<TipoTitulo> logger)
        : base(configuration, logger)
    {
    }
    public async Task<TipoTitulo?> GetById(int id)
    {
        return await DbSet
            .FirstOrDefaultAsync(x => x.Id.Equals(id));
    }
}