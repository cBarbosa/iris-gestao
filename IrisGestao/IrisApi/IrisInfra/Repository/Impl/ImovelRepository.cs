using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ImovelRepository : Repository<Imovel>, IImovelRepository
{
    public ImovelRepository(IConfiguration configuration, ILogger<Imovel> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<IEnumerable<Imovel>> GetById(int codigo)
    {
        return await  DbSet
                .Include(x => x.Unidade)
                .Include(x => x.IdClienteProprietarioNavigation)
                .Include(x => x.IdCategoriaImovelNavigation)
            .Where(x => x.Id == codigo)
            .ToListAsync();
    }

    public async Task<CommandPagingResult?> GetAllPaging(int? idCategoria, string? nome, int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var imoveis = await DbSet
                        .Include(x => x.IdClienteProprietarioNavigation)
                        .Include(x => x.IdCategoriaImovelNavigation)
                        .Include(x => x.ImovelEndereco)
                        .Include(x => x.Unidade)
                    .Where(x => x.IdCategoriaImovel.Equals(TipoImovelEnum.IMOVEL_CARTEIRA))
                    // .Where(x => 
                    //         (idCategoria.HasValue && idCategoria.Equals(x.IdCategoriaImovel)
                    //             ||
                    //         (string.IsNullOrEmpty(nome) && x.Nome.Contains(nome))
                    //         ))
                    .ToListAsync();

            var totalCount = imoveis.Count();

            var imoveisPaging = imoveis.Skip(skip).Take(limit);

            if (imoveisPaging.Any())
                return new CommandPagingResult(imoveisPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message);
        }

        return null!;
    }
}