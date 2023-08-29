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

    public async Task<Cliente?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet
            .FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<object?> GetByGuid(Guid guid)
    {
        return await DbSet
                        .Include(x => x.Imovel)
                            .ThenInclude(y => y.Unidade)
                        .Include(x => x.Imovel)
                            .ThenInclude(y => y.ImovelEndereco)
                        .Include(z=> z.Contato)
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
                            Imovel = x.Imovel.Select(y => new
                            {
                                Nome                = y.Nome,
                                guidReferencia      = y.GuidReferencia,
                                NroUnidades         = y.Unidade.Where(x => x.Status).Count(),
                                AreaTotal           = y.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                                AreaUtil            = y.Unidade.Where(x => x.Status).Sum(x => x.AreaUtil),
                                AreaHabitese        = y.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                                NumCentroCusto      = y.NumCentroCusto,
                                ImovelEndereco      = y.ImovelEndereco,
                                Ativo               = y.Status,
                                IdCategoriaImovelNavigation = y.IdCategoriaImovelNavigation == null ? null : new
                                {
                                    Id = y.IdCategoriaImovelNavigation.Id,
                                    Nome = y.IdCategoriaImovelNavigation.Nome
                                },
                                IdClienteProprietarioNavigation = y.IdClienteProprietarioNavigation == null ? null : new
                                {
                                    CpfCnpj         = x.CpfCnpj,
                                    Nome            = x.Nome,
                                    Telefone        = x.Telefone
                                }
                            }).Where(y => y.Ativo),
                            Contato = x.Contato.Select(z => new
                            {
                                Nome = z.Nome,
                                Cargo = z.Cargo,
                                Email = z.Email,
                                Telefone = z.Telefone,
                                DataNascimento = z.DataNascimento,
                                DataCriacao = z.DataCriacao,
                                DataAtualização = z.DataUltimaModificacao,
                                guidReferenciaContato  = z.GuidReferencia,
                            }).OrderBy(z=> z.Nome).ToList(),
                            ContratoAluguel = x.ContratoAluguel.Select(x => new
                            {
                                NumeroContrato = x.NumeroContrato,
                                ValorAluguel = x.ValorAluguel,
                                PercentualRetencaoImpostos = x.PercentualRetencaoImpostos,
                                ValorAluguelLiquido = x.ValorAluguelLiquido,
                                PercentualDescontoAluguel = x.PercentualDescontoAluguel,
                                CarenciaAluguel = x.CarenciaAluguel,
                                PrazoCarencia = x.PrazoCarencia,
                                DataInicioContrato = x.DataInicioContrato,
                                PrazoTotalContrato = x.PrazoTotalContrato,
                                DataFimContrato = x.DataFimContrato,
                                DataOcupacao = x.DataOcupacao,
                                DiaVencimentoAluguel = x.DiaVencimentoAluguel,
                                PeriodicidadeReajuste = x.PeriodicidadeReajuste,
                                DataCriacao = x.DataCriacao,
                                DataAtualização = x.DataUltimaModificacao,
                                GuidReferencia = x.GuidReferencia,
                                IndiceReajuste = x.IdIndiceReajusteNavigation == null ? null : new
                                {
                                    Id = x.IdIndiceReajusteNavigation.Id,
                                    Nome = x.IdIndiceReajusteNavigation.Nome,
                                    Percentual = x.IdIndiceReajusteNavigation.Percentual,
                                    DataAtualizacao = x.IdIndiceReajusteNavigation.DataAtualizacao
                                },
                            }),
                        })
                        .FirstOrDefaultAsync();
    }

    public async Task<CommandPagingResult?> GetAllPaging(int? idTipo, string? nome, int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var clientes = await DbSet
                .Include(x => x.IdTipoClienteNavigation)
                .Include(x => x.Imovel)
                    .ThenInclude(y => y.ImovelEndereco)
                .Include(x => x.ContratoAluguel)
                    .ThenInclude(y => y.IdIndiceReajusteNavigation)
                .Where(x =>
                        (idTipo.HasValue && idTipo.Value == 1
                            ? x.Imovel.Count > 0 
                            : true)
                        && (idTipo.HasValue && idTipo.Value == 2
                            ? x.ContratoAluguel.Count > 0
                            : true)
                        && (idTipo.HasValue && idTipo.Value == 3
                            ? x.ContratoAluguel.Count == 0 && x.Imovel.Count == 0
                            : true)
                        && (!string.IsNullOrEmpty(nome)
                            ? x.Nome.Contains(nome)
                            : true)
                            && (x.Status)
                    )
                    .Select(x => new
                    {
                        CpfCnpj = x.CpfCnpj,
                        GuidReferencia = x.GuidReferencia,
                        Nome = x.Nome,
                        RazaoSocial = x.RazaoSocial,
                        Email = x.Email,
                        Telefone = x.Telefone,
                        dataNascimento = x.DataNascimento,
                        IdTipoCliente = x.IdTipoCliente,
                        DataUltimaModificacao = x.DataUltimaModificacao,
                        cep = x.Cep,
                        endereco = x.Endereco,
                        bairro = x.Bairro,
                        cidade = x.Cidade,
                        estado = x.Estado,
                        Status = x.Status,
                        TotalImoveis = x.Imovel.Count(),
                        TotalContratosAluguel = x.ContratoAluguel.Count(),
                    })
                .OrderBy(x => x.Nome)
                .ToListAsync();

            var totalCount = clientes.Where(x => x.Status).Count();

            var clientesPaging = clientes.Skip(skip).Take(limit);

            if (clientesPaging.Any())
                return new CommandPagingResult(clientesPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, ex.Message);
        }

        return null!;
    }

    public async Task<IEnumerable<object>?> GetAllOwners()
    {
        return await DbSet
            .OrderBy(x => x.Nome)
            .Where(x => x.Status)
            .Select(x => new
            {
                Id = x.Id,
                GuidReferencia = x.GuidReferencia,
                x.CpfCnpj,
                Nome = x.Nome,
                QtdeImoveis = x.Imovel.Where(x => x.Status).Count()
            })
            .OrderBy(y => y.Nome)
            .ToListAsync();
    }

    public async Task<Cliente?> GetByCpfCnpj(string cpfCnpj)
    {
        try
        {
            return await DbSet
                .FirstOrDefaultAsync(x => x.CpfCnpj.Equals(cpfCnpj));
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }

        return null;
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