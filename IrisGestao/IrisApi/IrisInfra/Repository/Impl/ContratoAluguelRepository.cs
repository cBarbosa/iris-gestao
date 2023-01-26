using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContratoAluguelRepository: Repository<ContratoAluguel>, IContratoAluguelRepository
{
    public ContratoAluguelRepository(IConfiguration configuration, ILogger<ContratoAluguel> logger)
        : base(configuration, logger)
    {
        
    }
    public async Task<ContratoAluguel?> GetByGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<object?> GetByContratoAluguelGuid(Guid guid)
    {
        return await DbSet
                        .Include(y => y.IdClienteNavigation)
                            .ThenInclude(y=> y.IdTipoClienteNavigation)
                        .Include(x => x.ContratoAluguelImovel )
                            .ThenInclude(x=> x.ContratoAluguelUnidade)
                        .Where(x => x.GuidReferencia.Equals(guid) && x.Status)
                        .Select(x => new
                        {
                            NumeroContrato                  = x.NumeroContrato,
                            ValorAluguel                    = x.ValorAluguel,
                            PercentualRetencaoImpostos      = x.PercentualRetencaoImpostos,
                            ValorAluguelLiquido             = x.ValorAluguelLiquido,
                            PercentualDescontoAluguel       = x.PercentualDescontoAluguel,
                            CarenciaAluguel                 = x.CarenciaAluguel,
                            PrazoCarencia                   = x.PrazoCarencia,
                            DataInicioContrato              = x.DataInicioContrato,
                            PrazoTotalContrato              = x.PrazoTotalContrato,
                            DataFimContrato                 = x.DataFimContrato,
                            DataOcupacao                    = x.DataOcupacao,
                            DiaVencimentoAluguel            = x.DiaVencimentoAluguel,
                            PeriodicidadeReajuste           = x.PeriodicidadeReajuste,
                            DataCriacao                     = x.DataCriacao,
                            DataAtualização                 = x.DataUltimaModificacao,
                            GuidReferencia                  = x.GuidReferencia,
                            ExibirAlertaVencimento          = (x.DataFimContrato - DateTime.Now).Days <= 90 ? true : false,
                            Cliente                         = x.IdClienteNavigation == null ? null : new
                            {
                                CpfCnpj                     = x.IdClienteNavigation.CpfCnpj,
                                GuidReferencia              = x.IdClienteNavigation.GuidReferencia,
                                Nome                        = x.IdClienteNavigation.Nome,
                                RazaoSocial                 = x.IdClienteNavigation.RazaoSocial,
                                Email                       = x.IdClienteNavigation.Email,
                                Telefone                    = x.IdClienteNavigation.Telefone,
                                dataNascimento              = x.IdClienteNavigation.DataNascimento,
                                IdTipoCliente               = x.IdClienteNavigation.IdTipoCliente,
                                DataUltimaModificacao       = x.IdClienteNavigation.DataUltimaModificacao,
                                cep                         = x.IdClienteNavigation.Cep,
                                endereco                    = x.IdClienteNavigation.Endereco,
                                bairro                      = x.IdClienteNavigation.Bairro,
                                cidade                      = x.IdClienteNavigation.Cidade,
                                estado                      = x.IdClienteNavigation.Estado,
                                IdTipoClienteNavigation     = x.IdClienteNavigation.IdTipoClienteNavigation == null ? null : new
                                {
                                    Id                      = x.IdClienteNavigation.IdTipoClienteNavigation.Id,
                                    Nome                    = x.IdClienteNavigation.IdTipoClienteNavigation.Nome,
                                }
                            },
                            ImovelAlugado                   = x.ContratoAluguelImovel.Select(x => new
                            {
                                GuidReferencia              = x.IdImovelNavigation.GuidReferencia,
                                Nome                        = x.IdImovelNavigation.Nome,
                                NumCentroCusto              = x.IdImovelNavigation.NumCentroCusto,
                                ImovelEndereco              = x.IdImovelNavigation.ImovelEndereco,
                                Status                      = x.IdImovelNavigation.Status,
                                AreaTotal                   = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                                AreaUtil                    = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaUtil),
                                AreaHabitese                = x.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                                NroUnidadesTotal            = x.IdImovelNavigation.Unidade.Where(x => x.Status).Count(),
                                NroUnidadesContrato         = x.ContratoAluguelUnidade.Where(y => y.IdUnidadeNavigation.Status).Count(),
                                ImgCapa                     = "../../../../assets/images/imovel.png",
                                Imagens                     = ImagemListFake,
                                Anexos                      = AnexoListFake,
                                IdCategoriaImovelNavigation = x.IdImovelNavigation.IdCategoriaImovelNavigation == null ? null : new
                                {
                                    Id                      = x.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                                    Nome                    = x.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                                },
                                Unidades = x.ContratoAluguelUnidade.Select(y => new
                                {
                                    IdUnidae                = y.IdUnidadeNavigation.Id, 
                                    GuidReferencia          = y.IdUnidadeNavigation.GuidReferencia,
                                    IdImovel                = y.IdUnidadeNavigation.IdImovel,
                                    AreaUtil                = y.IdUnidadeNavigation.AreaUtil,
                                    AreaTotal               = y.IdUnidadeNavigation.AreaTotal,
                                    AreaHabitese            = y.IdUnidadeNavigation.AreaHabitese,
                                    InscricaoIPTU           = y.IdUnidadeNavigation.InscricaoIPTU,
                                    Matricula               = y.IdUnidadeNavigation.Matricula,
                                    MatriculaEnergia        = y.IdUnidadeNavigation.MatriculaEnergia,
                                    MatriculaAgua           = y.IdUnidadeNavigation.MatriculaAgua,
                                    TaxaAdministracao       = y.IdUnidadeNavigation.TaxaAdministracao,
                                    Tipo                    = y.IdUnidadeNavigation.Tipo,
                                    ValorPotencial          = y.IdUnidadeNavigation.ValorPotencial,
                                    DataCriacao             = y.IdUnidadeNavigation.DataCriacao,
                                    DataUltimaModificacao   = y.IdUnidadeNavigation.DataUltimaModificacao,
                                    Ativo                   = y.IdUnidadeNavigation.Status,
                                    IdTipoUnidadeNavigation = new
                                    {
                                        Id                  = y.IdUnidadeNavigation.IdTipoUnidadeNavigation.Id,
                                        Nome                = y.IdUnidadeNavigation.IdTipoUnidadeNavigation.Nome
                                    }
                                }).Where(y => y.Ativo)
                            }),
                        }).ToListAsync();
    }

    public async Task<CommandPagingResult?> GetAllPaging(int? idTipoImovel, int? idBaseReajuste, DateTime? dthInicioVigencia, DateTime? dthFimVigencia, string? numeroContrato, int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var contratos = await DbSet
                        .Include(y => y.IdClienteNavigation)
                            .ThenInclude(y => y.IdTipoClienteNavigation)
                        .Include(x => x.ContratoAluguelImovel)
                            .ThenInclude(x => x.ContratoAluguelUnidade)
                        .Where(x => (idBaseReajuste.HasValue
                                        ? x.IdIndiceReajuste.Equals(idBaseReajuste.Value)
                                        : true)
                                    && (!string.IsNullOrEmpty(numeroContrato)
                                        ? x.NumeroContrato.Contains(numeroContrato!)
                                        : true)
                                   && ((dthInicioVigencia.HasValue && dthFimVigencia.HasValue)
                                        ? (x.DataInicioContrato >= dthInicioVigencia && x.DataFimContrato <= dthFimVigencia) : true)
                        )
                        .Select(x => new
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
                            ExibirAlertaVencimento = (x.DataFimContrato - DateTime.Now).Days <= 90 ? true : false,
                            Cliente = x.IdClienteNavigation == null ? null : new
                            {
                                CpfCnpj = x.IdClienteNavigation.CpfCnpj,
                                GuidReferencia = x.IdClienteNavigation.GuidReferencia,
                                Nome = x.IdClienteNavigation.Nome,
                                RazaoSocial = x.IdClienteNavigation.RazaoSocial,
                            },
                            ImovelAlugado = x.ContratoAluguelImovel.Select(x => new
                            {
                                GuidReferencia = x.IdImovelNavigation.GuidReferencia,
                                Nome = x.IdImovelNavigation.Nome,
                                NumCentroCusto = x.IdImovelNavigation.NumCentroCusto,
                                Status = x.IdImovelNavigation.Status,
                                IdCategoriaImovelNavigation = x.IdImovelNavigation.IdCategoriaImovelNavigation == null ? null : new
                                {
                                    Id = x.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                                    Nome = x.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                                }
                            }),
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