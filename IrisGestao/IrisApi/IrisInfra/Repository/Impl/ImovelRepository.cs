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
                            //.ThenInclude(y => y.IdTipoUnidadeNavigation)
                        .Where(x => x.IdCategoriaImovel.Equals(TipoImovelEnum.IMOVEL_CARTEIRA))
                        .Select(x => new
                        {
                            GuidReferencia = x.GuidReferencia,
                            Nome = x.Nome,
                            ImovelEndereco = x.ImovelEndereco,
                            Unidade = x.Unidade,
                            AreaTotal = x.Unidade.Sum(x => x.AreaTotal),
                            AreaUtil = x.Unidade.Sum(x => x.AreaUtil),
                            AreaHabitese = x.Unidade.Sum(x => x.AreaHabitese),
                            NroUnidades = x.Unidade.Count,
                            ImgCapa = "../../../../assets/images/imovel.png",
                            Imagens = new List<string>
                            {
                                ".../../../assets/images/property/1.jpg",
                                ".../../../assets/images/property/2.jpg",
                                ".../../../assets/images/property/3.jpg",
                                ".../../../assets/images/property/4.jpg",
                                ".../../../assets/images/property/5.jpg",
                                ".../../../assets/images/property/edit.jpg",
                            },
                            Anexos = new List<object>
                            {
                                new
                                {
                                    Nome = "Projeto",
                                    Tipo = 1,
                                    FileName = "Projeto.pdf",
                                    URI = "https://templates.legal/download/6446/?tmstv=1671603263&version=pdf"
                                },
                                new
                                {
                                    Nome = "Matricula",
                                    Tipo = 2,
                                    FileName = "Matricula.pdf",
                                    URI = "https://templates.legal/download/6446/?tmstv=1671603263&version=pdf"
                                },
                                new
                                {
                                    Nome = "Habite-se",
                                    FileName = "habite-se.pdf",
                                    Tipo = 3,
                                    URI = "https://templates.legal/download/6446/?tmstv=1671603263&version=pdf"
                                }
                            },
                            IdCategoriaImovelNavigation = x.IdCategoriaImovelNavigation == null ? null : new 
                            {
                                Id = x.IdCategoriaImovelNavigation.Id,
                                Nome = x.IdCategoriaImovelNavigation.Nome
                            },
                            IdClienteProprietarioNavigation = x.IdClienteProprietarioNavigation == null ? null : new 
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
                                    : new 
                                    {
                                        Id = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Id,
                                        Nome = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Nome,
                                    }
                            }
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