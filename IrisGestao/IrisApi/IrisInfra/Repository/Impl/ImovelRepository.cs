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


    public IEnumerable<Imovel> GetAll(int? idCategoriaImovel, string nome)
    {
        if (idCategoriaImovel.HasValue && !String.IsNullOrEmpty(nome))
        {
            var lstImovel = DbSet.Include(x => x.Unidade)
                                    .Include(x => x.IdClienteProprietarioNavigation)
                                    .Include(x => x.IdCategoriaImovelNavigation).IgnoreAutoIncludes()
                                    .Where(x => x.IdCategoriaImovel == idCategoriaImovel && x.Nome.Contains(nome))
                                    .ToList();

            return lstImovel.AsEnumerable();
        }
        else if (idCategoriaImovel.HasValue)
        {
            var lstImovel = DbSet.Include(x => x.Unidade)
                                    .Include(x => x.IdClienteProprietarioNavigation)
                                    .Include(x => x.IdCategoriaImovelNavigation).IgnoreAutoIncludes()
                                    .Where(x => x.IdCategoriaImovel == idCategoriaImovel)
                                    .ToList();

            return lstImovel.AsEnumerable();
        }
        else if (!String.IsNullOrEmpty(nome))
        {
            var lstImovel = DbSet.Include(x => x.Unidade)
                                    .Include(x => x.IdClienteProprietarioNavigation)
                                    .Include(x => x.IdCategoriaImovelNavigation).IgnoreAutoIncludes()
                                    .Where(x => x.Nome.Contains(nome))
                                    .ToList();

            return lstImovel.AsEnumerable();
        }
        else 
        {
            var lstImovel = DbSet.Include(x => x.Unidade)
                                    .Include(x => x.IdClienteProprietarioNavigation)
                                    .Include(x => x.IdCategoriaImovelNavigation).IgnoreAutoIncludes()
                                    .ToList();

            return lstImovel.AsEnumerable();
        }
    }
}