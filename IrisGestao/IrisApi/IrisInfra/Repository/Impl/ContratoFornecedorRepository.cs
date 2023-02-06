using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContratoFornecedorRepository : Repository<ContratoFornecedor>, IContratoFornecedorRepository
{
    public ContratoFornecedorRepository(IConfiguration configuration, ILogger<ContratoFornecedor> logger)
        : base(configuration, logger)
    {
        
    }
    public async Task<ContratoFornecedor?> GetByGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<object?> GetByContratoFornecedorGuid(Guid guid)
    {
        return await DbSet
                        .Include(x => x.IdFornecedorNavigation)
                            .ThenInclude(x => x.Contato)
                        .Include(x => x.IdImovelNavigation)
                            .ThenInclude(x => x.ImovelEndereco)
                        .Include(x => x.IdFormaPagamentoNavigation)
                        .Include(x => x.IdIndiceReajusteNavigation)
                        .Include(x => x.IdTipoServicoNavigation)
                        .Include(x => x.IdUnidadeNavigation)
                        .Where(x => x.GuidReferencia.Equals(guid) && x.Status)
                        .Select(x => new
                        {
                            NumeroContrato = x.NumeroContrato,
                            Percentual = x.Percentual,
                            DataAtualizacao = x.DataAtualizacao,
                            ValorServicoContratado = x.ValorServicoContratado,
                            DataInicioContrato = x.DataInicioContrato,
                            PrazoTotalMeses = x.PrazoTotalMeses,
                            DataFimContrato = x.DataFimContrato,
                            DiaPagamento = x.DiaPagamento,
                            PeriodicidadeReajuste = x.PeriodicidadeReajuste,
                            GuidReferencia = x.GuidReferencia,
                            DataCriacao = x.DataCriacao,
                            DataAtualização = x.DataUltimaModificacao,
                            Status = x.Status,
                            ExibirAlertaVencimento = (x.DataFimContrato - DateTime.Now).Days <= 90 ? true : false,
                            ImgCapa = "../../../../assets/images/imovel.png",
                            Imagens = ImagemListFake,
                            Anexos = AnexoListFake,
                            Imovel = x.IdImovelNavigation == null ? null : new
                            {
                                GuidReferencia = x.IdImovelNavigation.GuidReferencia,
                                Nome = x.IdImovelNavigation.Nome,
                                NumCentroCusto = x.IdImovelNavigation.NumCentroCusto,
                                Status = x.IdImovelNavigation.Status,
                                AreaTotal = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                                AreaUtil = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaUtil),
                                AreaHabitese = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                                NroUnidades = x.IdImovelNavigation.Unidade.Where(x => x.Status).Count(),
                                ImovelEndereco = x.IdImovelNavigation.ImovelEndereco,
                                IdCategoriaImovelNavigation = x.IdImovelNavigation.IdCategoriaImovelNavigation == null ? null : new
                                {
                                    Id = x.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                                    Nome = x.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                                },
                            },
                            Unidade = x.IdUnidadeNavigation == null ? null : new
                            {
                                GuidReferencia = x.IdUnidadeNavigation.GuidReferencia,
                                IdImovel = x.IdUnidadeNavigation.IdImovel,
                                AreaUtil = x.IdUnidadeNavigation.AreaUtil,
                                AreaTotal = x.IdUnidadeNavigation.AreaTotal,
                                AreaHabitese = x.IdUnidadeNavigation.AreaHabitese,
                                InscricaoIPTU = x.IdUnidadeNavigation.InscricaoIPTU,
                                Matricula = x.IdUnidadeNavigation.Matricula,
                                MatriculaEnergia = x.IdUnidadeNavigation.MatriculaEnergia,
                                MatriculaAgua = x.IdUnidadeNavigation.MatriculaAgua,
                                TaxaAdministracao = x.IdUnidadeNavigation.TaxaAdministracao,
                                Tipo = x.IdUnidadeNavigation.Tipo,
                                ValorPotencial = x.IdUnidadeNavigation.ValorPotencial,
                                DataCriacao = x.IdUnidadeNavigation.DataCriacao,
                                DataUltimaModificacao = x.IdUnidadeNavigation.DataUltimaModificacao,
                                Ativo = x.IdUnidadeNavigation.Status,
                                IdTipoUnidadeNavigation = new
                                {
                                    Id = x.IdUnidadeNavigation.IdTipoUnidadeNavigation.Id,
                                    Nome = x.IdUnidadeNavigation.IdTipoUnidadeNavigation.Nome
                                }
                            },
                            IndiceReajuste = x.IdIndiceReajusteNavigation == null ? null : new
                            {
                                Id = x.IdIndiceReajusteNavigation.Id,
                                Nome = x.IdIndiceReajusteNavigation.Nome,
                                Percentual = x.IdIndiceReajusteNavigation.Percentual,
                                DataAtualizacao = x.IdIndiceReajusteNavigation.DataAtualizacao,
                            },
                            FormaPagamento = x.IdFormaPagamentoNavigation == null ? null : new
                            {
                                Id = x.IdFormaPagamentoNavigation.Id,
                                Nome = x.IdFormaPagamentoNavigation.Nome
                            },
                            Fornecedor = x.IdFornecedorNavigation == null ? null : new
                            {
                                CpfCnpj = x.IdFornecedorNavigation.CpfCnpj,
                                GuidReferencia = x.IdFornecedorNavigation.GuidReferencia,
                                Nome = x.IdFornecedorNavigation.Nome,
                                RazaoSocial = x.IdFornecedorNavigation.RazaoSocial,
                                Contato = x.IdFornecedorNavigation.Contato.Select(z => new
                                {
                                    Nome = z.Nome,
                                    Cargo = z.Cargo,
                                    Email = z.Email,
                                    Telefone = z.Telefone,
                                    DataNascimento = z.DataNascimento,
                                    DataCriacao = z.DataCriacao,
                                    DataAtualização = z.DataUltimaModificacao,
                                    guidReferenciaContato = z.GuidReferencia,
                                })
                            },
                            TipodeServico = x.IdTipoServicoNavigation == null ? null : new
                            {
                                Id = x.IdTipoServicoNavigation.Id,
                                Nome = x.IdTipoServicoNavigation.Nome
                            },
                        }).ToListAsync();
    }

    public async Task<CommandPagingResult?> GetAllPaging(string numeroContrato, int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var contratos = await DbSet
                        .Include(y => y.IdClienteNavigation)
                            .ThenInclude(y => y.IdTipoClienteNavigation)
                        .Include(x => x.IdFornecedorNavigation)
                            .ThenInclude(x => x.Contato)
                        .Include(x => x.IdFormaPagamentoNavigation)
                        .Include(x => x.IdImovelNavigation)
                            .ThenInclude(x => x.ImovelEndereco)
                        .Include(x => x.IdIndiceReajusteNavigation)
                        .Include(x => x.IdTipoServicoNavigation)
                        .Include(x => x.IdUnidadeNavigation)
                        .Where(x => (!string.IsNullOrEmpty(numeroContrato)
                                        ? x.NumeroContrato.Contains(numeroContrato!)
                                        : true)
                        )
                        .Select(x => new
                        {
                            NumeroContrato                  = x.NumeroContrato,
                            Percentual                      = x.Percentual,
                            DataAtualizacao                 = x.DataAtualizacao,
                            ValorServicoContratado          = x.ValorServicoContratado,
                            DataInicioContrato              = x.DataInicioContrato,
                            PrazoTotalMeses                 = x.PrazoTotalMeses,
                            DataFimContrato                 = x.DataFimContrato,
                            DiaPagamento                    = x.DiaPagamento,
                            PeriodicidadeReajuste           = x.PeriodicidadeReajuste,
                            GuidReferencia                  = x.GuidReferencia,
                            DataCriacao                     = x.DataCriacao,
                            DataAtualização                 = x.DataUltimaModificacao,
                            Status                          = x.Status,
                            ExibirAlertaVencimento          = (x.DataFimContrato - DateTime.Now).Days <= 90 ? true : false,
                            ImgCapa                         = "../../../../assets/images/imovel.png",
                            Imagens                         = ImagemListFake,
                            Anexos                          = AnexoListFake,
                            Imovel = x.IdImovelNavigation == null ? null : new
                            {
                                GuidReferencia              = x.IdImovelNavigation.GuidReferencia,
                                Nome                        = x.IdImovelNavigation.Nome,
                                NumCentroCusto              = x.IdImovelNavigation.NumCentroCusto,
                                Status                      = x.IdImovelNavigation.Status,
                                AreaTotal                   = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                                AreaUtil                    = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaUtil),
                                AreaHabitese                = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                                NroUnidades                 = x.IdImovelNavigation.Unidade.Where(x => x.Status).Count(),
                                ImovelEndereco = x.IdImovelNavigation.ImovelEndereco,
                                IdCategoriaImovelNavigation = x.IdImovelNavigation.IdCategoriaImovelNavigation == null ? null : new
                                {
                                    Id                      = x.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                                    Nome                    = x.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                                },
                            },
                            Unidade = x.IdUnidadeNavigation == null ? null : new
                            {
                                GuidReferencia              = x.IdUnidadeNavigation.GuidReferencia,
                                IdImovel                    = x.IdUnidadeNavigation.IdImovel,
                                AreaUtil                    = x.IdUnidadeNavigation.AreaUtil,
                                AreaTotal                   = x.IdUnidadeNavigation.AreaTotal,
                                AreaHabitese                = x.IdUnidadeNavigation.AreaHabitese,
                                InscricaoIPTU               = x.IdUnidadeNavigation.InscricaoIPTU,
                                Matricula                   = x.IdUnidadeNavigation.Matricula,
                                MatriculaEnergia            = x.IdUnidadeNavigation.MatriculaEnergia,
                                MatriculaAgua               = x.IdUnidadeNavigation.MatriculaAgua,
                                TaxaAdministracao           = x.IdUnidadeNavigation.TaxaAdministracao,
                                Tipo                        = x.IdUnidadeNavigation.Tipo,
                                ValorPotencial              = x.IdUnidadeNavigation.ValorPotencial,
                                DataCriacao                 = x.IdUnidadeNavigation.DataCriacao,
                                DataUltimaModificacao       = x.IdUnidadeNavigation.DataUltimaModificacao,
                                Ativo                       = x.IdUnidadeNavigation.Status,
                                IdTipoUnidadeNavigation = new
                                {
                                    Id                      = x.IdUnidadeNavigation.IdTipoUnidadeNavigation.Id,
                                    Nome                    = x.IdUnidadeNavigation.IdTipoUnidadeNavigation.Nome
                                }
                            },
                            IndiceReajuste = x.IdIndiceReajusteNavigation == null ? null : new
                            {
                                Id                          = x.IdIndiceReajusteNavigation.Id,
                                Nome                        = x.IdIndiceReajusteNavigation.Nome,
                                Percentual                  = x.IdIndiceReajusteNavigation.Percentual,
                                DataAtualizacao             = x.IdIndiceReajusteNavigation.DataAtualizacao,
                            },
                            FormaPagamento = x.IdFormaPagamentoNavigation == null ? null : new
                            {
                                Id                          = x.IdFormaPagamentoNavigation.Id,
                                Nome                        = x.IdFormaPagamentoNavigation.Nome
                            },
                            Cliente = x.IdClienteNavigation == null ? null : new
                            {
                                CpfCnpj                     = x.IdClienteNavigation.CpfCnpj,
                                GuidReferencia              = x.IdClienteNavigation.GuidReferencia,
                                Nome                        = x.IdClienteNavigation.Nome,
                                RazaoSocial                 = x.IdClienteNavigation.RazaoSocial,
                                Contato = x.IdClienteNavigation.Contato.Select(z => new
                                {
                                    Nome                    = z.Nome,
                                    Cargo                   = z.Cargo,
                                    Email                   = z.Email,
                                    Telefone                = z.Telefone,
                                    DataNascimento          = z.DataNascimento,
                                    DataCriacao             = z.DataCriacao,
                                    DataAtualização         = z.DataUltimaModificacao,
                                    guidReferenciaContato   = z.GuidReferencia,
                                })
                            },
                            Fornecedor = x.IdFornecedorNavigation == null ? null : new
                            {
                                CpfCnpj                     = x.IdFornecedorNavigation.CpfCnpj,
                                GuidReferencia              = x.IdFornecedorNavigation.GuidReferencia,
                                Nome                        = x.IdFornecedorNavigation.Nome,
                                RazaoSocial                 = x.IdFornecedorNavigation.RazaoSocial,
                                Contato = x.IdFornecedorNavigation.Contato.Select(z => new
                                {
                                    Nome                    = z.Nome,
                                    Cargo                   = z.Cargo,
                                    Email                   = z.Email,
                                    Telefone                = z.Telefone,
                                    DataNascimento          = z.DataNascimento,
                                    DataCriacao             = z.DataCriacao,
                                    DataAtualização         = z.DataUltimaModificacao,
                                    guidReferenciaContato   = z.GuidReferencia,
                                })
                            },
                            TipodeServico = x.IdTipoServicoNavigation == null ? null : new
                            {
                                Id                          = x.IdTipoServicoNavigation.Id,
                                Nome                        = x.IdTipoServicoNavigation.Nome
                            },
                        }).ToListAsync();

            var totalCount = contratos.Count();

            var contratosPaging = contratos.Skip(skip).Take(limit);

            if (contratosPaging.Any())
                return new CommandPagingResult(contratosPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message);
        }

        return null!;
    }

    public static string ImagemCapaFake => "../../../../assets/images/imovel.png";

    public static List<object> ImagemListFake => new List<object>
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

    public static List<object> AnexoListFake => new List<object>
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