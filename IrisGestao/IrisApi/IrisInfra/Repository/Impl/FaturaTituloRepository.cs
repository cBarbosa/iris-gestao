using Azure;
using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class FaturaTituloRepository : Repository<FaturaTitulo>, IFaturaTituloRepository
{
    public FaturaTituloRepository(IConfiguration configuration, ILogger<FaturaTitulo> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<FaturaTitulo?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<IEnumerable<FaturaTitulo>> GetFaturasByTitulo(int idTitulo)
    {
        return await DbSet
            .Where(x => x.IdTitulo.Equals(idTitulo) && x.Status)
            .ToListAsync();
    }
}