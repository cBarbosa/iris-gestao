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
                            .ThenInclude(y => y.IdTipoUnidadeNavigation)
                        .Where(x => x.IdCategoriaImovel.Equals(TipoImovelEnum.IMOVEL_CARTEIRA))
                        .Select(x => new
                        {
                            GuidReferencia = x.GuidReferencia,
                            Nome = x.Nome,
                            ImovelEndereco = x.ImovelEndereco,
                            Unidade = x.Unidade.Select(y => new
                                {
                                    GuidReferencia = y.GuidReferencia,
                                    IdImovel = y.IdImovel,
                                    AreaUtil = y.AreaUtil,
                                    AreaTotal = y.AreaTotal,
                                    AreaHabitese = y.AreaHabitese,
                                    InscricaoIPTU = y.InscricaoIPTU,
                                    MatriculaEnergia = y.MatriculaEnergia,
                                    MatriculaAgua = y.MatriculaAgua,
                                    TaxaAdministracao = y.TaxaAdministracao,
                                    ValorPotencial = y.ValorPotencial,
                                    DataCriacao = y.DataCriacao,
                                    DataUltimaModificacao = y.DataUltimaModificacao,
                                    IdTipoUnidadeNavigation = new
                                    {
                                        Id = y.IdTipoUnidadeNavigation.Id,
                                        Nome = y.IdTipoUnidadeNavigation.Nome
                                    }
                                }
                                ),
                            AreaTotal = x.Unidade.Sum(x => x.AreaTotal),
                            AreaUtil = x.Unidade.Sum(x => x.AreaUtil),
                            AreaHabitese = x.Unidade.Sum(x => x.AreaHabitese),
                            NroUnidades = x.Unidade.Count,
                            ImgCapa = "../../../../assets/images/imovel.png",
                            Imagens = ImagemListFake,
                            Anexos = AnexoListFake,
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

    public async Task<object?> GetByGuid(Guid guid)
    {
        return await DbSet
                        .Include(x => x.IdClienteProprietarioNavigation)
                            .ThenInclude(y => y.IdTipoClienteNavigation)
                        .Include(x => x.IdCategoriaImovelNavigation)
                        .Include(x => x.ImovelEndereco)
                        .Include(x => x.Unidade)
                            .ThenInclude(y => y.IdTipoUnidadeNavigation)
                        .Where(x => x.GuidReferencia.Equals(guid))
                        .Select(x => new
                        {
                            GuidReferencia = x.GuidReferencia,
                            Nome = x.Nome,
                            ImovelEndereco = x.ImovelEndereco,
                            Unidade = x.Unidade.Select(y => new
                                {
                                    GuidReferencia = y.GuidReferencia,
                                    IdImovel = y.IdImovel,
                                    AreaUtil = y.AreaUtil,
                                    AreaTotal = y.AreaTotal,
                                    AreaHabitese = y.AreaHabitese,
                                    InscricaoIPTU = y.InscricaoIPTU,
                                    MatriculaEnergia = y.MatriculaEnergia,
                                    MatriculaAgua = y.MatriculaAgua,
                                    TaxaAdministracao = y.TaxaAdministracao,
                                    ValorPotencial = y.ValorPotencial,
                                    DataCriacao = y.DataCriacao,
                                    DataUltimaModificacao = y.DataUltimaModificacao,
                                    UnidadeLocada = y.UnidadeLocada,
                                    IdTipoUnidadeNavigation = new
                                    {
                                        Id = y.IdTipoUnidadeNavigation.Id,
                                        Nome = y.IdTipoUnidadeNavigation.Nome
                                    }
                                }
                                ),
                            AreaTotal = x.Unidade.Sum(x => x.AreaTotal),
                            AreaUtil = x.Unidade.Sum(x => x.AreaUtil),
                            AreaHabitese = x.Unidade.Sum(x => x.AreaHabitese),
                            NroUnidades = x.Unidade.Count,
                            ImgCapa = "../../../../assets/images/imovel.png",
                            Imagens = ImagemListFake,
                            Anexos = AnexoListFake,
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
                    .FirstOrDefaultAsync();
    }
    
    public async Task<Imovel?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet
            .FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    private static List<object> ImagemListFake => new List<object>
    {
        new
        {
            ThumbUrl =".../../../assets/images/property/1.jpg",
            Url = ".../../../assets/images/property/1.jpg"
        },
        new
        {
            ThumbUrl =".../../../assets/images/property/2.png",
            Url = ".../../../assets/images/property/2.png"
        },
        new
        {
            ThumbUrl =".../../../assets/images/property/3.png",
            Url = ".../../../assets/images/property/3.png"
        },
        new
        {
            ThumbUrl =".../../../assets/images/property/4.png",
            Url = ".../../../assets/images/property/4.png"
        },
        new
        {
            ThumbUrl =".../../../assets/images/property/5.png",
            Url = ".../../../assets/images/property/5.png"
        },
        new
        {
            ThumbUrl =".../../../assets/images/property/2.png",
            Url = ".../../../assets/images/property/2.png"
        },
        new
        {
            ThumbUrl =".../../../assets/images/property/4.png",
            Url = ".../../../assets/images/property/4.png"
        }
    };
    
    private static List<object> AnexoListFake => new List<object>
    {
        new
        {
            Nome = "Projeto",
            Tipo = 1,
            FileName = "Projeto.pdf",
            URI = "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
        },
        new
        {
            Nome = "Matricula",
            FileName = "Matricula.pdf",
            Tipo = 2,
            URI = "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
        },
        new
        {
            Nome = "Habite-se",
            FileName = "habite-se.pdf",
            Tipo = 3,
            URI = "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
        }
    };
}