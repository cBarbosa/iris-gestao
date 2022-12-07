using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ClienteRepository : Repository<Cliente>, IClienteRepository
{
    public ClienteRepository(IConfiguration configuration, ILogger<Cliente> logger)
        : base(configuration, logger)
    {
        
    }
}