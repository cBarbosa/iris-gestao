using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoEventoRepository : Repository<TipoEvento>, ITipoEventoRepository
{
    public TipoEventoRepository(IConfiguration configuration, ILogger<TipoEvento> logger)
        : base(configuration, logger)
    {
        
    }
}