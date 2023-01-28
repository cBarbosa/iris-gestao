using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoCreditoAluguelRepository : Repository<TipoCreditoAluguel>, ITipoCreditoAluguelRepository
{
    public TipoCreditoAluguelRepository(IConfiguration configuration, ILogger<TipoCreditoAluguel> logger)
        : base(configuration, logger)
    {
        
    }
}