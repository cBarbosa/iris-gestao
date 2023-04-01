using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContratoAluguelHistoricoReajusteRepository : Repository<ContratoAluguelHistoricoReajuste>, IContratoAluguelHistoricoReajusteRepository
{
    public ContratoAluguelHistoricoReajusteRepository(IConfiguration configuration, ILogger<ContratoAluguelHistoricoReajuste> logger)
        : base(configuration, logger)
    {

    }
    public async Task<ContratoAluguelHistoricoReajuste?> GetByGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<object?> GetByGuidContratoAluguel(Guid guid)
    {
        return await DbSet
                        .Include(y => y.IdContratoAluguelNavigation)
                        .Where(x => x.IdContratoAluguelNavigation.GuidReferencia.Equals(guid))
                        .Select(x => new
                        {
                            Id = x.Id,
                            DataCriacao = x.DataCriacao,
                            GuidReferencia = x.GuidReferencia,
                            PercentualReajusteAntigo = x.PercentualReajusteAnterior,
                            PercentualReajusteNovo = x.PercentualReajusteNovo,
                            ValorAluguelAnterior = x.ValorAluguelAnterior,
                            ValorAluguelNovo = x.ValorAluguelNovo,
                            AlteradoPor = x.AlteradoPor,
                        }).ToListAsync();
    }
}