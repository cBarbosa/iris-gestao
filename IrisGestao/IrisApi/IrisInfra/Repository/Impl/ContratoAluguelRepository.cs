using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography.X509Certificates;

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
                        .Include(x => x.IdIndiceReajusteNavigation)
                        .Where(x => x.GuidReferencia.Equals(guid) && x.Status)
                        .Select(x => new
                        {
                            NumeroContrato                  = x.NumeroContrato,
                            ValorAluguel                    = x.ValorAluguel,
                            ValorAluguelLiquido             = x.ValorAluguelLiquido,
                            ValorComDesconto                = x.ValorComDesconto,
                            ValorComImopstos                = x.ValorComImpostos,
                            PercentualRetencaoImpostos      = x.PercentualRetencaoImpostos,
                            PercentualDescontoAluguel       = x.PercentualDescontoAluguel,
                            PrazoDesconto                   = x.PrazoDesconto,
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
                            IndiceReajuste = x.IdIndiceReajusteNavigation == null ? null : new
                            {
                                Id                          = x.IdIndiceReajusteNavigation.Id,
                                Nome                        = x.IdIndiceReajusteNavigation.Nome,
                                Percentual                  = x.IdIndiceReajusteNavigation.Percentual,
                                DataAtualizacao             = x.IdIndiceReajusteNavigation.DataAtualizacao
                            },
                            CreditoAluguel = x.IdTipoCreditoAluguelNavigation == null ? null : new
                            {
                                Id = x.IdTipoCreditoAluguelNavigation.Id,
                                Nome = x.IdTipoCreditoAluguelNavigation.Nome
                            },
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
                                },
                                Contato = x.IdClienteNavigation.Contato.Select(x => new
                                {
                                    Nome                    = x.Nome,
                                    Cargo                   = x.Cargo,
                                    Email                   = x.Email,
                                    Telefone                = x.Telefone,
                                    DataNascimento          = x.DataNascimento,
                                    DataCriacao             = x.DataCriacao,
                                    DataAtualização         = x.DataUltimaModificacao,
                                    guidReferenciaContato   = x.GuidReferencia,
                                })
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
                            TituloReceber                   = x.TituloReceber.Select(x => new
                            {
                                NumeroTitulo = x.NumeroTitulo,
                                NomeTitulo = x.NomeTitulo,
                                GuidReferencia = x.GuidReferencia,
                                Status = x.Status,
                                Parcelas = x.Parcelas,
                                ValorTitulo = x.ValorTitulo,
                                ValorTotalTitulo = x.ValorTotalTitulo,
                                DataCriacao = x.DataCriacao,
                                DataAtualização = x.DataUltimaModificacao,
                                DataVencimentoPrimeraParcela = x.DataVencimentoPrimeraParcela,
                                PorcentagemTaxaAdministracao = x.PorcentagemTaxaAdministracao,
                                TipoTituloReceber = x.IdTipoTituloNavigation == null ? null : new
                                {
                                    Id = x.IdTipoTituloNavigation.Id,
                                    Nome = x.IdTipoTituloNavigation.Nome
                                },
                                IndiceReajuste = x.IdIndiceReajusteNavigation == null ? null : new
                                {
                                    Id = x.IdIndiceReajusteNavigation.Id,
                                    Nome = x.IdIndiceReajusteNavigation.Nome,
                                    Percentual = x.IdIndiceReajusteNavigation.Percentual,
                                    DataAtualizacao = x.IdIndiceReajusteNavigation.DataAtualizacao,
                                },
                                CreditoAluguel = x.IdTipoCreditoAluguelNavigation == null ? null : new
                                {
                                    Id = x.IdTipoCreditoAluguelNavigation.Id,
                                    Nome = x.IdTipoCreditoAluguelNavigation.Nome
                                },
                                Cliente = x.IdClienteNavigation == null ? null : new
                                {
                                    CpfCnpj = x.IdClienteNavigation.CpfCnpj,
                                    GuidReferencia = x.IdClienteNavigation.GuidReferencia,
                                    Nome = x.IdClienteNavigation.Nome,
                                    RazaoSocial = x.IdClienteNavigation.RazaoSocial,
                                },
                                FormaPagamento = x.IdFormaPagamentoNavigation == null ? null : new
                                {
                                    Id = x.IdFormaPagamentoNavigation.Id,
                                    Nome = x.IdFormaPagamentoNavigation.Nome
                                },
                                Faturas = x.FaturaTitulo.Select(x => new
                                {
                                    GuidReferencia = x.GuidReferencia,
                                    NumeroFatura = x.NumeroFatura,
                                    NumeroParcela = x.NumeroParcela,
                                    ValorFatura = x.Valor,
                                    DataEnvio = x.DataEnvio,
                                    DataPagamento = x.DataPagamento,
                                    DataVencimento = x.DataVencimento,
                                    DiasAtraso = x.DiasAtraso,
                                    DataCriacao = x.DataCriacao,
                                    DataUltimaModificacao = x.DataUltimaModificacao,
                                    DataEmissaoNotaFiscal = x.DataEmissaoNotaFiscal,
                                    Status = x.Status,
                                    StatusFatura = ((x.Status && x.DataPagamento == null && x.DataVencimento > DateTime.Now) ? FaturaTituloEnum.A_VENCER :
                                    (x.Status && x.DataPagamento == null && x.DataVencimento < DateTime.Now) ? FaturaTituloEnum.VENCIDO :
                                    (x.Status && x.DataPagamento != null) ? FaturaTituloEnum.PAGO : FaturaTituloEnum.INATIVO),
                                    NumeroNotaFiscal = x.NumeroNotaFiscal,
                                    PorcentagemImpostoRetido = x.PorcentagemImpostoRetido,
                                    ValorLiquidoTaxaAdministracao = x.ValorLiquidoTaxaAdministracao,
                                    ValorRealPago = x.ValorRealPago,
                                    DescricaoBaixaFatura = String.IsNullOrEmpty(x.DescricaoBaixaFatura) ? "" : x.DescricaoBaixaFatura,
                                }),
                            }),
                            HistoricoReajuste = x.ContratoAluguelHistoricoReajuste.Select(x => new
                            {
                                Id = x.Id,
                                GuidReferencia = x.GuidReferencia,
                                DataCriacao = x.DataCriacao,
                                PercentualReajusteAntigo = x.PercentualReajusteAnterior,
                                PercentualReajusteNovo = x.PercentualReajusteNovo,
                                ValorAluguelAnterior = x.ValorAluguelAnterior,
                                ValorAluguelNovo = x.ValorAluguelNovo,
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
                        .Include(x => x.IdIndiceReajusteNavigation)
                        .Where(x =>  x.Status
                                    && (idBaseReajuste.HasValue
                                        ? x.IdIndiceReajuste.Equals(idBaseReajuste.Value)
                                        : true)
                                    && (!string.IsNullOrEmpty(numeroContrato)
                                        ? x.NumeroContrato.Contains(numeroContrato!)
                                        : true)
                                   && ((dthInicioVigencia.HasValue && dthFimVigencia.HasValue)
                                        ? (x.DataInicioContrato >= dthInicioVigencia.Value && x.DataFimContrato <= dthFimVigencia.Value) : true)
                        )
                        .Select(x => new
                        {
                            NumeroContrato = x.NumeroContrato,
                            ValorAluguel = x.ValorAluguel,
                            ValorAluguelLiquido = x.ValorAluguelLiquido,
                            ValorComDesconto = x.ValorComDesconto,
                            ValorComImopstos = x.ValorComImpostos,
                            PercentualRetencaoImpostos = x.PercentualRetencaoImpostos,
                            PercentualDescontoAluguel = x.PercentualDescontoAluguel,
                            PrazoDesconto = x.PrazoDesconto,
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
                            IndiceReajuste = x.IdIndiceReajusteNavigation == null ? null : new
                            {
                                Id = x.IdIndiceReajusteNavigation.Id,
                                Nome = x.IdIndiceReajusteNavigation.Nome,
                                Percentual = x.IdIndiceReajusteNavigation.Percentual,
                                DataAtualizacao = x.IdIndiceReajusteNavigation.DataAtualizacao,
                            },
                            CreditoAluguel = x.IdTipoCreditoAluguelNavigation == null ? null : new
                            {
                                Id = x.IdTipoCreditoAluguelNavigation.Id,
                                Nome = x.IdTipoCreditoAluguelNavigation.Nome
                            },
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
                            TituloReceber = x.TituloReceber.Select(x => new
                            {
                                NumeroTitulo = x.NumeroTitulo,
                                NomeTitulo = x.NomeTitulo,
                                GuidReferencia = x.GuidReferencia,
                                Status = x.Status,
                                Parcelas = x.Parcelas,
                                ValorTitulo = x.ValorTitulo,
                                ValorTotalTitulo = x.ValorTitulo,
                                DataCriacao = x.DataCriacao,
                                DataAtualização = x.DataUltimaModificacao,
                                DataVencimentoPrimeraParcela = x.DataVencimentoPrimeraParcela,
                                PorcentagemTaxaAdministracao = x.PorcentagemTaxaAdministracao
                            }),
                        }).OrderBy(x=> x.DataFimContrato).ToListAsync();

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
}