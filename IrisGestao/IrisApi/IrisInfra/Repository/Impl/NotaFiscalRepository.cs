using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class NotaFiscalRepository: Repository<NotaFiscal>, INotaFiscalRepository
{
    public NotaFiscalRepository(IConfiguration configuration, ILogger<NotaFiscal> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<object?> GetByReferenceGuid(Guid uuid)
    {
        return await DbSet
            .Include(x => x.IdTipoServicoNavigation)
            .Where(x => x.GuidReferencia.Equals(uuid))
            .Select(x => new
            {
                x.GuidReferencia,
                x.NumeroNota,
                x.ValorServico,
                x.ValorOrcado,
                x.ValorContratado,
                x.DataEmissao,
                x.DataVencimento,
                x.PercentualAdministracaoObra,
                TipoServico = new
                {
                    x.IdTipoServico,
                    x.IdTipoServicoNavigation.Nome
                }
            })
            .ToListAsync();
    }

    public async Task<NotaFiscal?> GetByGuid(Guid uuid)
    {
        return await DbSet
            .SingleOrDefaultAsync(x => x.GuidReferencia.Equals(uuid));
    }
}