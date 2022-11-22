using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoTituloRepository : Repository<TipoTitulo>, ITipoTituloRepository
{
    public TipoTituloRepository(IConfiguration configuration, ILogger<TipoTitulo> logger)
        : base(configuration, logger)
    {
        
    }
}