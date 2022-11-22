using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoContratoRepository : Repository<TipoContrato>, ITipoContratoRepository
{
    public TipoContratoRepository(IConfiguration configuration, ILogger<TipoContrato> logger)
        : base(configuration, logger)
    {
        
    }
}