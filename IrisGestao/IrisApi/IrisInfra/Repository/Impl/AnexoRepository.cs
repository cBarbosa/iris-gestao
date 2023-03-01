using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class AnexoRepository: Repository<Anexo>, IAnexoRepository
{
    public AnexoRepository(IConfiguration configuration, ILogger<Anexo> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<IEnumerable<Anexo>> GetByGuid(Guid uuid)
    {
        return await DbSet
            .Where(x => x.GuidReferencia.Equals(uuid))
            .ToListAsync();
    }
    
    public async Task<IEnumerable<Anexo>> GetByClassificacao(Guid uuid, string classificacao)
    {
        return await DbSet
            .Where(x => x.GuidReferencia.Equals(uuid) && x.Classificacao.Equals(classificacao))
            .ToListAsync();
    }
}