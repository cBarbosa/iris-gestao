using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TipoDespesaRepository : Repository<TipoDespesa>, ITipoDespesaRepository
{
    public TipoDespesaRepository(IConfiguration configuration, ILogger<TipoDespesa> logger)
        : base(configuration, logger)
    {
        
    }
}