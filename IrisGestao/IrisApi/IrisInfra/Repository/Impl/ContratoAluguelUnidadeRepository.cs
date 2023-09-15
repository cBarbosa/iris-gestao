using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContratoAluguelUnidadeRepository : Repository<ContratoAluguelUnidade>, IContratoAluguelUnidadeRepository
{
    public ContratoAluguelUnidadeRepository(IConfiguration configuration, ILogger<ContratoAluguelUnidade> logger)
        : base(configuration, logger)
    {

    }

    public async Task<ContratoAluguelUnidade?> GetById(int id)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<ContratoAluguelUnidade>> GetAllUnidadesByContratoAluguel(Guid contratoAluguel)
    {
        var lstUnidades = DbSet
                    .Include(x => x.IdContratoAluguelImovelNavigation)
                        .ThenInclude(y => y.IdContratoAluguelNavigation).ToList()
                    .Where(x => x.IdContratoAluguelImovelNavigation.IdContratoAluguelNavigation.GuidReferencia.Equals(contratoAluguel));
 

        return lstUnidades.AsEnumerable().ToList();
    }


}