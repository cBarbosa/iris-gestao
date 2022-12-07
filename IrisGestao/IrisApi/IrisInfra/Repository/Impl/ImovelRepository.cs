using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ImovelRepository : Repository<Imovel>, IImovelRepository
{
    public ImovelRepository(IConfiguration configuration, ILogger<Imovel> logger)
        : base(configuration, logger)
    {
        
    }

    public IEnumerable<Imovel> GetById(int codigo)
    {
        var lstImovel = DbSet.Include(x => x.Unidade)
                                .Include(x => x.IdClienteProprietarioNavigation)
                                .Include(x => x.IdCategoriaImovelNavigation)
                                .Where(x => x.Id == codigo).ToList();

        return lstImovel.AsEnumerable();
    }


    public IEnumerable<Imovel> GetAll()
    {
        var lstImovel = DbSet.Include(x => x.Unidade)
                                .Include(x => x.IdClienteProprietarioNavigation)
                                .Include(x => x.IdCategoriaImovelNavigation).ToList();

        return lstImovel.AsEnumerable();
    }
}