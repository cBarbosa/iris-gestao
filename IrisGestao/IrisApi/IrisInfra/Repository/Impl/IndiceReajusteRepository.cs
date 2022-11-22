using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class IndiceReajusteRepository : Repository<IndiceReajuste>, IIndiceReajusteRepository
{
    public IndiceReajusteRepository(IConfiguration configuration, ILogger<IndiceReajuste> logger)
        : base(configuration, logger)
    {
        
    }
}