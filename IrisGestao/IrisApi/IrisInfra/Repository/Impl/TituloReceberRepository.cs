using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Xml.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class TituloReceberRepository : Repository<TituloReceber>, ITituloReceberRepository
{
    public TituloReceberRepository(IConfiguration configuration, ILogger<TituloReceber> logger)
        : base(configuration, logger)
    {

    }

    public async Task<TituloReceber?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }
    
    public async Task<TituloReceber?> GetByContratoAluguelId(int idContratoAluguel)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.IdContratoAluguel.Equals(idContratoAluguel));
    }

    public async Task<int> GetNumeroTitulo()
    {
        try
        {
            return await DbSet.Select(x => x.Sequencial).MaxAsync();
        }
        catch (Exception)
        {
            return 100000;
        }
    }

    public async Task<object?> GetByTituloReceberGuid(Guid guid)
    {
        return await DbSet
                    .Include(x => x.IdContratoAluguelNavigation)
                        .ThenInclude(x => x.IdTipoContratoNavigation)
                    .Include(x => x.IdClienteNavigation)
                    .Include(x => x.IdTipoTituloNavigation)
                    .Include(x => x.IdIndiceReajusteNavigation)
                    .Include(x => x.TituloImovel)
                        .ThenInclude(x => x.TituloUnidade)
                    .Include(x => x.FaturaTitulo)
                    .Where(x => x.GuidReferencia.Equals(guid))
                    .Select(x => new
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
                        DataVencimentoTitulo = x.DataFimTitulo,
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
                        ContratoAluguel = x.IdContratoAluguelNavigation == null ? null : new
                        {
                            GuidReferencia = x.IdContratoAluguelNavigation.GuidReferencia,
                            NumeroContrato = x.IdContratoAluguelNavigation.NumeroContrato,
                            ValorAluguel = x.IdContratoAluguelNavigation.ValorAluguel,
                            PercentualRetencaoImpostos = x.IdContratoAluguelNavigation.PercentualRetencaoImpostos,
                            ValorAluguelLiquido = x.IdContratoAluguelNavigation.ValorAluguelLiquido,
                            PercentualDescontoAluguel = x.IdContratoAluguelNavigation.PercentualDescontoAluguel,
                            CarenciaAluguel = x.IdContratoAluguelNavigation.CarenciaAluguel,
                            PrazoCarencia = x.IdContratoAluguelNavigation.PrazoCarencia,
                            DataInicioContrato = x.IdContratoAluguelNavigation.DataInicioContrato,
                            PrazoTotalContrato = x.IdContratoAluguelNavigation.PrazoTotalContrato,
                            DataFimContrato = x.IdContratoAluguelNavigation.DataFimContrato,
                            DataOcupacao = x.IdContratoAluguelNavigation.DataOcupacao,
                            DiaVencimentoAluguel = x.IdContratoAluguelNavigation.DiaVencimentoAluguel,
                            PeriodicidadeReajuste = x.IdContratoAluguelNavigation.PeriodicidadeReajuste,
                            DataCriacao = x.IdContratoAluguelNavigation.DataCriacao,
                            DataAtualização = x.IdContratoAluguelNavigation.DataUltimaModificacao,
                        },
                        Faturas = x.FaturaTitulo.Select(x => new
                        {
                            GuidReferencia = x.GuidReferencia,
                            NumeroFatura = x.NumeroFatura,
                            ValorFatura = x.Valor,
                            DataEnvio = x.DataEnvio,
                            DataPagamento = x.DataPagamento,
                            DataVencimento = x.DataVencimento,
                            DiasAtraso = x.DiasAtraso,
                            DataCriacao = x.DataCriacao,
                            DataUltimaModificacao = x.DataUltimaModificacao,
                            DataEmissaoNotaFiscal = x.DataEmissaoNotaFiscal,
                            Status = x.Status,
                            NumeroParcela = x.NumeroParcela,
                            StatusFatura = ((x.Status && x.DataPagamento == null && x.DataVencimento > DateTime.Now) ? FaturaTituloEnum.A_VENCER :
                            (x.Status && x.DataPagamento == null && x.DataVencimento < DateTime.Now) ? FaturaTituloEnum.VENCIDO :
                            (x.Status && x.DataPagamento != null && x.StatusFatura == "Pago") ? FaturaTituloEnum.PAGO :
                            (x.Status && x.DataPagamento != null && x.StatusFatura == "Parcial") ? FaturaTituloEnum.PARCIAL : FaturaTituloEnum.INATIVO),
                            NumeroNotaFiscal = x.NumeroNotaFiscal,
                            PorcentagemImpostoRetido = x.PorcentagemImpostoRetido,
                            ValorLiquidoTaxaAdministracao = x.ValorLiquidoTaxaAdministracao,
                            ValorRealPago = x.ValorRealPago,
                            DescricaoBaixaFatura = String.IsNullOrEmpty(x.DescricaoBaixaFatura) ? "" : x.DescricaoBaixaFatura,
                        }).OrderBy(x=> x.DataVencimento).ToList(),
                        Imoveis = x.TituloImovel.Select(y => new
                        {
                            Nome = y.IdImovelNavigation.Nome,
                            guidReferencia = y.IdImovelNavigation.GuidReferencia,
                            NroUnidades = y.IdImovelNavigation.Unidade.Where(x => x.Status).Count(),
                            AreaTotal = y.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                            AreaUtil = y.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaUtil),
                            AreaHabitese = y.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                            NumCentroCusto = y.IdImovelNavigation.NumCentroCusto,
                            ImovelEndereco = y.IdImovelNavigation.ImovelEndereco,
                            Ativo = y.IdImovelNavigation.Status,
                            IdCategoriaImovelNavigation = y.IdImovelNavigation.IdCategoriaImovelNavigation == null ? null : new
                            {
                                Id = y.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                                Nome = y.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                            },
                            IdClienteProprietarioNavigation = y.IdImovelNavigation.IdClienteProprietarioNavigation == null ? null : new
                            {
                                CpfCnpj = y.IdImovelNavigation.IdClienteProprietarioNavigation.CpfCnpj,
                                Nome = y.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
                                Telefone = y.IdImovelNavigation.IdClienteProprietarioNavigation.Telefone
                            },
                            Unidades = y.TituloUnidade.Select(y => new
                            {
                                GuidReferencia = y.IdUnidadeNavigation.GuidReferencia,
                                IdImovel = y.IdUnidadeNavigation.IdImovel,
                                AreaUtil = y.IdUnidadeNavigation.AreaUtil,
                                AreaTotal = y.IdUnidadeNavigation.AreaTotal,
                                AreaHabitese = y.IdUnidadeNavigation.AreaHabitese,
                                InscricaoIPTU = y.IdUnidadeNavigation.InscricaoIPTU,
                                Matricula = y.IdUnidadeNavigation.Matricula,
                                MatriculaEnergia = y.IdUnidadeNavigation.MatriculaEnergia,
                                MatriculaAgua = y.IdUnidadeNavigation.MatriculaAgua,
                                TaxaAdministracao = y.IdUnidadeNavigation.TaxaAdministracao,
                                Tipo = y.IdUnidadeNavigation.Tipo,
                                ValorPotencial = y.IdUnidadeNavigation.ValorPotencial,
                                DataCriacao = y.IdUnidadeNavigation.DataCriacao,
                                DataUltimaModificacao = y.IdUnidadeNavigation.DataUltimaModificacao,
                                Ativo = y.IdUnidadeNavigation.Status,
                                IdTipoUnidadeNavigation = new
                                {
                                    Id = y.IdUnidadeNavigation.IdTipoUnidadeNavigation.Id,
                                    Nome = y.IdUnidadeNavigation.IdTipoUnidadeNavigation.Nome
                                }
                            }),
                        }),
                    }).ToListAsync(); 
    }

    public async Task<CommandPagingResult?> GetAllPaging(string? numeroTitulo, int? idTipoTitulo, int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var contratos = await DbSet
                        .Include(x => x.IdContratoAluguelNavigation)
                            .ThenInclude(x => x.IdTipoContratoNavigation)
                        .Where(x => x.Status.Value &&
                                    (idTipoTitulo.HasValue
                                        ? x.IdTipoTituloNavigation.Id == idTipoTitulo.Value
                                        : true)
                                    && (!string.IsNullOrEmpty(numeroTitulo)
                                        ? x.NumeroTitulo.Contains(numeroTitulo!)
                                        : true))
                        .Select(x => new
                        {
                            NumeroTitulo = x.NumeroTitulo,
                            NomeTitulo = x.NomeTitulo,
                            GuidReferencia = x.GuidReferencia,
                            Status = x.Status,
                            Parcelas = x.Parcelas,
                            ValorTitulo = x.ValorTitulo,
                            ValorTotalTitulo = x.ValorTotalTitulo,
                            DataCriacao = x.DataCriacao,
                            DataFimTitulo = x.DataFimTitulo,
                            DataAtualização = x.DataUltimaModificacao,
                            DataUltimaParcela = x.FaturaTitulo.OrderByDescending(x=> x.DataVencimento).FirstOrDefault().DataVencimento,
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
                            Imoveil = x.TituloImovel.Select(y => new
                            {
                                Nome = y.IdImovelNavigation.Nome,
                                guidReferencia = y.IdImovelNavigation.GuidReferencia,
                                NroUnidades = y.IdImovelNavigation.Unidade.Where(x => x.Status).Count(),
                                AreaTotal = y.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                                AreaUtil = y.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaUtil),
                                AreaHabitese = y.IdImovelNavigation.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                                NumCentroCusto = y.IdImovelNavigation.NumCentroCusto,
                                ImovelEndereco = y.IdImovelNavigation.ImovelEndereco,
                                Ativo = y.IdImovelNavigation.Status,
                                IdCategoriaImovelNavigation = y.IdImovelNavigation.IdCategoriaImovelNavigation == null ? null : new
                                {
                                    Id = y.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                                    Nome = y.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                                },
                                IdClienteProprietarioNavigation = y.IdImovelNavigation.IdClienteProprietarioNavigation == null ? null : new
                                {
                                    CpfCnpj = y.IdImovelNavigation.IdClienteProprietarioNavigation.CpfCnpj,
                                    Nome = y.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
                                    Telefone = y.IdImovelNavigation.IdClienteProprietarioNavigation.Telefone
                                },
                            }),
                        }).OrderBy(x=> x.DataFimTitulo).ToListAsync();

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