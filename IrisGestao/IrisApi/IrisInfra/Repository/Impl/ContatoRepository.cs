using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContatoRepository: Repository<Contato>, IContatoRepository
{
    public ContatoRepository(IConfiguration configuration, ILogger<Contato> logger)
        : base(configuration, logger)
    {
        
    }
}