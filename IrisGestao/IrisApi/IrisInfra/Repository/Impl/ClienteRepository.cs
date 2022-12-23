using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ClienteRepository : Repository<Cliente>, IClienteRepository
{
    public ClienteRepository(IConfiguration configuration, ILogger<Cliente> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<object?> GetByGuid(Guid guid)
    {
        return await DbSet
                        .Include(x => x.IdTipoClienteNavigation)
                        .Include(x => x.Imovel)
                            .ThenInclude(y => y.Unidade)
                        .Include(x => x.Imovel)
                            .ThenInclude(y => y.ImovelEndereco)
                        .Where(x => x.GuidReferencia.Equals(guid))
                        .Select(x => new
                        {
                            
                            CpfCnpj                 = x.CpfCnpj,
                            GuidReferencia          = x.GuidReferencia,
                            Nome                    = x.Nome,
                            RazaoSocial             = x.RazaoSocial,
                            Email                   = x.Email,
                            Telefone                = x.Telefone,
                            dataNascimento          = x.DataNascimento,
                            IdTipoCliente           = x.IdTipoCliente,
                            DataUltimaModificacao   = x.DataUltimaModificacao,
                            cep                     = x.Cep,
                            endereco                = x.Endereco,
                            bairro                  = x.Bairro,
                            cidade                  = x.Cidade,
                            estado                  = x.Estado,
                            IdTipoClienteNavigation = new
                            {
                                Id = x.IdTipoClienteNavigation.Id,
                                Nome = x.IdTipoClienteNavigation.Nome
                            },
                            Imovel = x.Imovel.Select(y => new
                            {
                                Nome                = y.Nome,
                                guidReferencia      = y.GuidReferencia,
                                NroUnidades         = y.Unidade.Count,
                                AreaTotal           = y.Unidade.Sum(x => x.AreaTotal),
                                AreaUtil            = y.Unidade.Sum(x => x.AreaUtil),
                                AreaHabitese        = y.Unidade.Sum(x => x.AreaHabitese),
                                ImgCapa             = "../../../../assets/images/imovel.png",
                                Imagens             = ImagemListFake,
                                Anexos              = AnexoListFake,
                                ImovelEndereco      = y.ImovelEndereco,
                                IdCategoriaImovelNavigation = y.IdCategoriaImovelNavigation
                            })
                        })
                        .FirstOrDefaultAsync();
    }

    public async Task<CommandPagingResult?> GetAllPaging(int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var clientes = await DbSet
                .Include(x => x.IdTipoClienteNavigation)
                .Include(x => x.Imovel)
                    .ThenInclude(y => y.ImovelEndereco)
                .ToListAsync();

            var totalCount = clientes.Count();

            var clientesPaging = clientes.Skip(skip).Take(limit);

            if (clientesPaging.Any())
                return new CommandPagingResult(clientesPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message);
        }

        return null!;
    }

    public async Task<IEnumerable<object>?> GetAllOwners()
    {
        return await DbSet
            .Where(x => x.Imovel.Any())
            .OrderBy(x => x.Nome)
            .Select(x => new
            {
                Id = x.Id,
                GuidReferencia = x.GuidReferencia,
                Nome = x.Nome,
                QtdeImoveis = x.Imovel.Count()
            })
            .ToListAsync();
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