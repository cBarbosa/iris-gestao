using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoClienteRepository : Repository<TipoCliente>, ITipoClienteRepository
{
    public TipoClienteRepository(IConfiguration configuration, ILogger<TipoCliente> logger)
        : base(configuration, logger)
    {
        
    }
}