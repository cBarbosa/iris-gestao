using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class AnexoRepository: Repository<Anexo>, IAnexoRepository
{
    public AnexoRepository(IConfiguration configuration, ILogger<Anexo> logger)
        : base(configuration, logger)
    {
        
    }
}