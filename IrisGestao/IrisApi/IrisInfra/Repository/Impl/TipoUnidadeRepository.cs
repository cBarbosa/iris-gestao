using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoUnidadeRepository : Repository<TipoUnidade>, ITipoUnidadeRepository
{
    public TipoUnidadeRepository(IConfiguration configuration, ILogger<TipoUnidade> logger)
        : base(configuration, logger)
    {
        
    }
}