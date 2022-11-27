using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ImovelEnderecoRepository : Repository<ImovelEndereco>, IImovelEnderecoRepository
{
    public ImovelEnderecoRepository(IConfiguration configuration, ILogger<ImovelEndereco> logger)
        : base(configuration, logger)
    {
        
    }

    public IEnumerable<ImovelEndereco> GetById(int codigo)
    {
        var lstImovelEndereco = DbSet.Include(x => x.IdImovelNavigation)
                                .Where(x => x.Id == codigo).ToList();

        return lstImovelEndereco.AsEnumerable();
    }

    public IEnumerable<ImovelEndereco> BuscarEnderecoPorImovel(int codigo)
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Where(x => x.IdImovel == codigo).ToList();

        return lstUnidades.AsEnumerable();
    }
}