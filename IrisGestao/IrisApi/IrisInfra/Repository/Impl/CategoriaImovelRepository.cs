using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class CategoriaImovelRepository : Repository<CategoriaImovel>, ICategoriaImovelRepository
{
    public CategoriaImovelRepository(IConfiguration configuration, ILogger<CategoriaImovel> logger)
        : base(configuration, logger)
    {
        
    }
}