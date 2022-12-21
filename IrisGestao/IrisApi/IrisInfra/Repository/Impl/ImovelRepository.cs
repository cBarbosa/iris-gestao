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
                        .ThenInclude(y => y.IdTipoClienteNavigation)
                        .Include(x => x.IdCategoriaImovelNavigation)
                        .Include(x => x.ImovelEndereco)
                        .Include(x => x.Unidade)
                        .Where(x => x.IdCategoriaImovel.Equals(TipoImovelEnum.IMOVEL_CARTEIRA))
                        .Select(x => new Imovel
                        {
                            GuidReferencia = x.GuidReferencia,
                            Nome = x.Nome,
                            IdCategoriaImovelNavigation = new CategoriaImovel
                            {
                                Id = x.IdCategoriaImovelNavigation.Id,
                                Nome = x.IdCategoriaImovelNavigation.Nome
                            },
                            IdClienteProprietarioNavigation = new Cliente
                            {
                                GuidReferencia = x.IdClienteProprietarioNavigation.GuidReferencia,
                                CpfCnpj = x.IdClienteProprietarioNavigation.CpfCnpj,
                                Nome = x.IdClienteProprietarioNavigation.Nome,
                                Cep = x.IdClienteProprietarioNavigation.Cep,
                                Endereco = x.IdClienteProprietarioNavigation.Endereco,
                                Bairro = x.IdClienteProprietarioNavigation.Bairro,
                                Cidade = x.IdClienteProprietarioNavigation.Cidade,
                                Estado = x.IdClienteProprietarioNavigation.Estado,
                                IdTipoClienteNavigation = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation == null
                                    ? null
                                    : new TipoCliente
                                    {
                                        Id = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Id,
                                        Nome = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Nome,
                                    }
                            },
                            ImovelEndereco = {},
                            Unidade = { }
                        })
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