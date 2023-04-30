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

public class FaturaTituloPagarRepository : Repository<FaturaTituloPagar>, IFaturaTituloPagarRepository
{
    public FaturaTituloPagarRepository(IConfiguration configuration, ILogger<FaturaTituloPagar> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<FaturaTituloPagar?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<IEnumerable<FaturaTituloPagar>> GetFaturasByTitulo(int idTitulo)
    {
        return await DbSet
            .Where(x => x.IdTituloPagar.Equals(idTitulo) && x.Status)
            .ToListAsync();
    }
}