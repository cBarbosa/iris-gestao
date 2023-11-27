﻿using System.Data;
using System.Linq;
using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using IrisGestao.Domain.Procs;
using IrisGestao.Infraestructure.ORM;
using Microsoft.Data.SqlClient;
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
                .Where(x => x.GuidReferencia.Equals(guid) && x.Status)
             .Select( contratoDb=> new
             {
                 contratoDb.NumeroContrato,
                 contratoDb.ValorAluguel,
                 contratoDb.ValorAluguelLiquido,
                 contratoDb.ValorComDesconto,
                 contratoDb.ValorComImpostos,
                 contratoDb.PercentualRetencaoImpostos,
                 contratoDb.PercentualDescontoAluguel,
                 contratoDb.PrazoDesconto,
                 contratoDb.CarenciaAluguel,
                 contratoDb.PrazoCarencia,
                 contratoDb.DataInicioContrato,
                 contratoDb.PrazoTotalContrato,
                 contratoDb.DataFimContrato,
                 contratoDb.DataOcupacao,
                 contratoDb.DiaVencimentoAluguel,
                 contratoDb.PeriodicidadeReajuste,
                 contratoDb.DataCriacao,
                 contratoDb.DataUltimaModificacao,
                 contratoDb.DataVencimentoPrimeraParcela,
                 contratoDb.GuidReferencia,
                 ExibirAlertaVencimento = (contratoDb.DataFimContrato - DateTime.Now).Days <= 90,
                 TipoContrato = contratoDb.IdTipoContratoNavigation == null ? null : new
                 {
                     contratoDb.IdTipoContratoNavigation.Id,
                     contratoDb.IdTipoContratoNavigation.Nome,
                 },
                 IndiceReajuste = contratoDb.IdIndiceReajusteNavigation == null ? null : new
                 {
                     contratoDb.IdIndiceReajusteNavigation.Id,
                     contratoDb.IdIndiceReajusteNavigation.Nome,
                     contratoDb.IdIndiceReajusteNavigation.Percentual,
                     contratoDb.IdIndiceReajusteNavigation.DataAtualizacao,
                 },
                 CreditoAluguel = contratoDb.IdTipoCreditoAluguelNavigation == null ? null : new
                 {
                     contratoDb.IdTipoCreditoAluguelNavigation.Id,
                     contratoDb.IdTipoCreditoAluguelNavigation.Nome
                 },
                 Cliente = contratoDb.IdClienteNavigation == null ? null : new
                 {
                     contratoDb.IdClienteNavigation.CpfCnpj,
                     contratoDb.IdClienteNavigation.GuidReferencia,
                     contratoDb.IdClienteNavigation.Nome,
                     contratoDb.IdClienteNavigation.RazaoSocial,
                     contratoDb.IdClienteNavigation.Email,
                     contratoDb.IdClienteNavigation.Telefone,
                     contratoDb.IdClienteNavigation.DataNascimento,
                     contratoDb.IdClienteNavigation.IdTipoCliente,
                     contratoDb.IdClienteNavigation.DataUltimaModificacao,
                     contratoDb.IdClienteNavigation.Cep,
                     contratoDb.IdClienteNavigation.Endereco,
                     contratoDb.IdClienteNavigation.Bairro,
                     contratoDb.IdClienteNavigation.Cidade,
                     contratoDb.IdClienteNavigation.Estado,
                     IdTipoClienteNavigation = contratoDb.IdClienteNavigation.IdTipoClienteNavigation == null ? null : new
                     {
                         contratoDb.IdClienteNavigation.IdTipoClienteNavigation.Id,
                         contratoDb.IdClienteNavigation.IdTipoClienteNavigation.Nome,
                     },
                     Contato = contratoDb.IdClienteNavigation.Contato.Select(c => new
                     {
                         c.Nome,
                         c.Cargo,
                         c.Email,
                         c.Telefone,
                         c.DataNascimento,
                         c.DataCriacao,
                         c.DataUltimaModificacao,
                         c.GuidReferencia,
                     })
                 },
                 lstImoveisVinculados = contratoDb.ContratoAluguelImovel.Select(imovelAlugado => new
                 {
                     idContratoImovel = imovelAlugado.Id,
                     guidImovel = imovelAlugado.IdImovelNavigation.GuidReferencia,
                     lstUnidades = imovelAlugado.ContratoAluguelUnidade.Select(unidadeAlugada => new
                     {
                         guidUnidade = unidadeAlugada.IdUnidadeNavigation.GuidReferencia,
                         Ativo = unidadeAlugada.IdUnidadeNavigation.Status,
                         IdContratoUnidade = unidadeAlugada.Id,
                         unidadeAlugada.IdUnidadeNavigation.AreaUtil,
                         unidadeAlugada.IdUnidadeNavigation.AreaTotal,
                         unidadeAlugada.IdUnidadeNavigation.AreaHabitese,
                         unidadeAlugada.IdUnidadeNavigation.InscricaoIPTU,
                         unidadeAlugada.IdUnidadeNavigation.Matricula,
                         unidadeAlugada.IdUnidadeNavigation.MatriculaEnergia,
                         unidadeAlugada.IdUnidadeNavigation.MatriculaAgua,
                         unidadeAlugada.IdUnidadeNavigation.TaxaAdministracao,
                         unidadeAlugada.IdUnidadeNavigation.Tipo,
                         unidadeAlugada.IdUnidadeNavigation.ValorPotencial,
                         unidadeAlugada.IdUnidadeNavigation.DataCriacao,
                         unidadeAlugada.IdUnidadeNavigation.DataUltimaModificacao,
                         IdTipoUnidadeNavigation = new
                         {
                             unidadeAlugada.IdUnidadeNavigation.IdTipoUnidadeNavigation.Id,
                             unidadeAlugada.IdUnidadeNavigation.IdTipoUnidadeNavigation.Nome
                         }
                     }).Where(unidadeAlugada => unidadeAlugada.Ativo)
                 }),
                 ImovelAlugado = contratoDb.ContratoAluguelImovel.Select(imovel => new
                 {
                     imovel.IdImovelNavigation.GuidReferencia,
                     imovel.IdImovelNavigation.Nome,
                     imovel.IdImovelNavigation.NumCentroCusto,
                     ImovelEndereco = imovel.IdImovelNavigation.ImovelEndereco.Select(endereco => new
                     {
                         endereco.Id,
                         endereco.IdImovel,
                         endereco.Bairro,
                         endereco.DataCriacao,
                         endereco.Cep,
                         endereco.Cidade,
                         endereco.Complemento,
                         endereco.Rua,
                         endereco.UF,
                         endereco.DataUltimaModificacao
                     }),
                     imovel.IdImovelNavigation.Status,
                     AreaTotal = imovel.IdImovelNavigation.Unidade.Where(u => u.Status).Sum(u => u.AreaTotal),
                     AreaUtil = imovel.IdImovelNavigation.Unidade.Where(u => u.Status).Sum(u => u.AreaUtil),
                     AreaHabitese = imovel.IdImovelNavigation.Unidade.Where(u => u.Status).Sum(u => u.AreaHabitese),
                     NroUnidadesTotal = imovel.IdImovelNavigation.Unidade.Where(u => u.Status).Count(),
                     NroUnidadesContrato = imovel.ContratoAluguelUnidade.Where(u => u.IdUnidadeNavigation.Status).Count(),
                     IdCategoriaImovelNavigation = imovel.IdImovelNavigation.IdCategoriaImovelNavigation == null ? null : new
                     {
                         imovel.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                         imovel.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                     },
                     // IdClienteProprietarioNavigation = imovel.IdImovelNavigation.IdClienteProprietarioNavigation == null ? null : new
                     // {
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Id,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.GuidReferencia,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.CpfCnpj,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Telefone,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Email,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Cep,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Endereco,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Bairro,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Cidade,
                     //     imovel.IdImovelNavigation.IdClienteProprietarioNavigation.Estado,
                     //     IdTipoClienteNavigation = imovel.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation == null ? null : new
                     //     {
                     //         imovel.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Id,
                     //         imovel.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Nome,
                     //     }
                     // },
                     // Unidades = imovel.ContratoAluguelUnidade.Select(unidade => new
                     // {
                     //     unidade.IdUnidadeNavigation.Id,
                     //     unidade.IdUnidadeNavigation.GuidReferencia,
                     //     unidade.IdUnidadeNavigation.IdImovel,
                     //     unidade.IdUnidadeNavigation.AreaUtil,
                     //     unidade.IdUnidadeNavigation.AreaTotal,
                     //     unidade.IdUnidadeNavigation.AreaHabitese,
                     //     unidade.IdUnidadeNavigation.InscricaoIPTU,
                     //     unidade.IdUnidadeNavigation.Matricula,
                     //     unidade.IdUnidadeNavigation.MatriculaEnergia,
                     //     unidade.IdUnidadeNavigation.MatriculaAgua,
                     //     unidade.IdUnidadeNavigation.TaxaAdministracao,
                     //     unidade.IdUnidadeNavigation.Tipo,
                     //     unidade.IdUnidadeNavigation.ValorPotencial,
                     //     unidade.IdUnidadeNavigation.DataCriacao,
                     //     unidade.IdUnidadeNavigation.DataUltimaModificacao,
                     //     Ativo = unidade.IdUnidadeNavigation.Status,
                     //     IdTipoUnidadeNavigation = new
                     //     {
                     //         unidade.IdUnidadeNavigation.IdTipoUnidadeNavigation.Id,
                     //         unidade.IdUnidadeNavigation.IdTipoUnidadeNavigation.Nome
                     //     }
                     // }).Where(u => u.Ativo)
                 }),
                 HistoricoReajuste = contratoDb.ContratoAluguelHistoricoReajuste.Select(h => new
                 {
                     h.Id,
                     h.GuidReferencia,
                     h.DataCriacao,
                     h.PercentualReajusteAnterior,
                     h.PercentualReajusteNovo,
                     h.ValorAluguelAnterior,
                     h.ValorAluguelNovo,
                 }),
                 TituloReceber = contratoDb.TituloReceber.Select(t => new
                 {
                     t.NumeroTitulo,
                     t.NomeTitulo,
                     t.GuidReferencia,
                     t.Status,
                     t.Parcelas,
                     t.ValorTitulo,
                     t.ValorTotalTitulo,
                     t.DataCriacao,
                     t.DataUltimaModificacao,
                     t.DataVencimentoPrimeraParcela,
                     t.PorcentagemTaxaAdministracao,
                     TipoTituloReceber = t.IdTipoTituloNavigation == null ? null : new
                     {
                         t.IdTipoTituloNavigation.Id,
                         t.IdTipoTituloNavigation.Nome
                     },
                     IndiceReajuste = t.IdIndiceReajusteNavigation == null ? null : new
                     {
                         t.IdIndiceReajusteNavigation.Id,
                         t.IdIndiceReajusteNavigation.Nome,
                         t.IdIndiceReajusteNavigation.Percentual,
                         t.IdIndiceReajusteNavigation.DataAtualizacao,
                     },
                     CreditoAluguel = t.IdTipoCreditoAluguelNavigation == null ? null : new
                     {
                         t.IdTipoCreditoAluguelNavigation.Id,
                         t.IdTipoCreditoAluguelNavigation.Nome
                     },
                     Cliente = t.IdClienteNavigation == null ? null : new
                     {
                         t.IdClienteNavigation.CpfCnpj,
                         t.IdClienteNavigation.GuidReferencia,
                         t.IdClienteNavigation.Nome,
                         t.IdClienteNavigation.RazaoSocial,
                     },
                     FormaPagamento = t.IdFormaPagamentoNavigation == null ? null : new
                     {
                         t.IdFormaPagamentoNavigation.Id,
                         t.IdFormaPagamentoNavigation.Nome
                     },
                     Faturas = t.FaturaTitulo.Select(x => new
                     {
                         x.GuidReferencia,
                         x.NumeroFatura,
                         x.NumeroParcela,
                         ValorFatura = x.Valor,
                         x.DataEnvio,
                         x.DataPagamento,
                         x.DataVencimento,
                         x.DiasAtraso,
                         x.DataCriacao,
                         x.DataUltimaModificacao,
                         x.DataEmissaoNotaFiscal,
                         x.Status,
                         StatusFatura = ((x.Status && x.DataPagamento == null && x.DataVencimento > DateTime.Now) ? FaturaTituloEnum.A_VENCER :
                             (x.Status && x.DataPagamento == null && x.DataVencimento < DateTime.Now) ? FaturaTituloEnum.VENCIDO :
                             (x.Status && x.DataPagamento != null) ? FaturaTituloEnum.PAGO : FaturaTituloEnum.INATIVO),
                         x.NumeroNotaFiscal,
                         x.PorcentagemImpostoRetido,
                         x.ValorLiquidoTaxaAdministracao,
                         x.ValorRealPago,
                         DescricaoBaixaFatura = string.IsNullOrEmpty(x.DescricaoBaixaFatura) ? "" : x.DescricaoBaixaFatura,
                     }).OrderByDescending(x=> x.DataVencimento).ToList()
                 })
             })
            .SingleOrDefaultAsync();
    }

    public async Task<object?> GetUnidadesLocadasByContratoAluguelGuid(Guid guid)
    {
        var contratoDb = await DbSet
            .Include(x => x.ContratoAluguelImovel)
                .ThenInclude(x => x.ContratoAluguelUnidade)
            .Where(x => x.GuidReferencia.Equals(guid) 
                    && x.Status)
            .SingleOrDefaultAsync();

        var contratoData = new
        {
            contratoDb.NumeroContrato,
            contratoDb.GuidReferencia,
            ImovelAlugado = contratoDb.ContratoAluguelImovel.Select(imovelAlugado => new
            {
                GuidReferencia = imovelAlugado.IdImovelNavigation.GuidReferencia,
                nome = imovelAlugado.IdImovelNavigation.Nome,
                Unidades = imovelAlugado.ContratoAluguelUnidade.Select(unidadeAlugada => new
                {
                    GuidReferenciaUnidade = unidadeAlugada.IdUnidadeNavigation.GuidReferencia,
                    Ativo = unidadeAlugada.IdUnidadeNavigation.Status,
                    UnidadeLocada = unidadeAlugada.IdUnidadeNavigation.UnidadeLocada,
                    IdUnidade = unidadeAlugada.Id
                }).Where(unidadeAlugada => unidadeAlugada.Ativo)
            }),
        };

        return contratoData;
    }

    public async Task<CommandPagingResult?> GetAllPaging(int? idTipoImovel, int? idImovel, DateTime? dthInicioVigencia, DateTime? dthFimVigencia, string? nomeLocatario, int limit, int page)
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
                                    && (idImovel.HasValue
                                        ? x.ContratoAluguelImovel.First().IdImovel == idImovel.Value
                                        : true)
                                    && (!string.IsNullOrEmpty(nomeLocatario)
                                        ? x.IdClienteNavigation.Nome.Contains(nomeLocatario)
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
                            DataVencimentoPrimeraParcela = x.DataVencimentoPrimeraParcela,
                            DataProximoReajuste = x.DataProximoReajuste,
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
                                },
                                IdClienteProprietarioNavigation = x.IdImovelNavigation.IdClienteProprietarioNavigation == null ? null : new
                                {
                                    GuidReferencia = x.IdImovelNavigation.IdClienteProprietarioNavigation.GuidReferencia,
                                    CpfCnpj = x.IdImovelNavigation.IdClienteProprietarioNavigation.CpfCnpj,
                                    Nome = x.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
                                    Telefone = x.IdImovelNavigation.IdClienteProprietarioNavigation.Telefone,
                                    Email = x.IdImovelNavigation.IdClienteProprietarioNavigation.Email,
                                    IdTipoClienteNavigation = x.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation == null
                                    ? null
                                    : new
                                    {
                                        Id = x.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Id,
                                        Nome = x.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Nome,
                                    }
                                },
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
                                PorcentagemTaxaAdministracao = x.PorcentagemTaxaAdministracao,
                                DataUltimaFatura = x.FaturaTitulo.FirstOrDefault().DataVencimento
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

    // public async Task<object> GetDashboardTotalManagedArea(
    //     DateTime dateRefInit,
    //     DateTime dateRefEnd,
    //     int? idLocador)
    // {
    //     try
    //     {
    //         return await Db.Unidade
    //             .Include(u => u.IdImovelNavigation)
    //                 .ThenInclude(i => i.IdClienteProprietarioNavigation)
    //             .Where(u => (!idLocador.HasValue || idLocador.HasValue && u.IdImovelNavigation.IdClienteProprietario == idLocador)
    //                 && (u.IdImovelNavigation.IdClienteProprietarioNavigation.DataCriacao >= dateRefInit
    //                     && u.IdImovelNavigation.IdClienteProprietarioNavigation.DataCriacao <= dateRefEnd))
    //             .GroupBy(
    //                 u => u.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
    //                 (key, group) => new {
    //                     Percent = Math.Round((decimal)group.Count() * 100 / Db.Unidade
    //                         .Count(), 2),
    //                     Title = key,
    //                     Color = $"#{new Random().Next(0x1000000):X6}"
    //                 })
    //             .OrderByDescending(r => r.Percent)
    //             .Select(r => new {
    //                 r.Percent,
    //                 r.Title,
    //                 r.Color
    //             })
    //             .ToListAsync();
    //     }
    //     catch (Exception e)
    //     {
    //         Logger.LogError(e, e.Message);
    //     }
    //     return null!;
    // }
    
    public async Task<IEnumerable<SpFinancialVacancyResult>?> GetDashbaordFinancialVacancy(
        DateTime dateRefInit,
        DateTime dateRefEnd,
        int? idLocador,
        int? idTipoArea)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioContrato", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimContrato", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@ClienteID", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
            new ("@TipoArea", SqlDbType.Int)
                {Value = idTipoArea.HasValue ? idTipoArea : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpFinancialVacancyResult>("Exec Sp_FinancialVacancy @DataInicioContrato, @DataFimContrato, @ClienteID, @TipoArea",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpReceivingPerformanceResult>> GetDashbaordReceivingPerformance(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioContrato", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimContrato", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@ClienteID", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
        };

        return await Db
            .SqlQueryAsync<SpReceivingPerformanceResult>("Exec Sp_ReceivingPerformance @DataInicioContrato, @DataFimContrato, @ClienteID",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpAreaPriceResult>> GetDashbaordAreaPrice(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idImovel)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioContrato", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimContrato", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@ClienteID", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
            new ("@ImovelID", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpAreaPriceResult>("Exec Sp_AreaPrice @DataInicioContrato, @DataFimContrato, @ClienteID, @ImovelID",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpPhysicalVacancyResult>?> GetDashbaordPhysicalVacancy(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioContrato", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimContrato", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@ClienteID", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
        };

        return await Db
            .SqlQueryAsync<SpPhysicalVacancyResult>("Exec Sp_PhysicalVacancy @DataInicioContrato, @DataFimContrato, @ClienteID",
                parameters.ToArray());
    }

    public async Task<IEnumerable<Object>?> GetImoveisUnidadesContratoAluguelAtivos()
    {
        return await DbSet
                        .Include(x => x.ContratoAluguelImovel)
                            .ThenInclude(x => x.ContratoAluguelUnidade)
                        .Where(x => x.Status)
                        .Select(x => new
                        {
                            NumeroContrato = x.NumeroContrato,
                            Status = x.Status,
                            ImovelAlugado = x.ContratoAluguelImovel.Select(x => new
                            {
                                GuidReferencia = x.IdImovelNavigation.GuidReferencia,
                                Nome = x.IdImovelNavigation.Nome,
                                Status = x.IdImovelNavigation.Status,
                                Unidades = x.ContratoAluguelUnidade.Select(y => new
                                {
                                    GuidReferencia = y.IdUnidadeNavigation.GuidReferencia,
                                    Tipo = y.IdUnidadeNavigation.Tipo,
                                    Status = y.IdUnidadeNavigation.Status
                                }).Where(y => y.Status)
                            }).Where(y => y.Status)
                        }).ToListAsync();
    }

    public async Task<IEnumerable<SpLeasedAreaResult>?> GetReportLeasedArea(
        int? idImovel,
        int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpLeasedAreaResult>("Exec Sp_LeasedArea @IdImovel, @IdLocatario",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpRentValueResult>?> GetReportRentValue(
        int? idImovel,
        int? idLocador,
        int? idLocatario,
        DateTime? dateRef)
    {
        var parameters = new List<SqlParameter> {
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
            new ("@DataReferencia", SqlDbType.Date)
                {Value = dateRef ?? DateTime.Today}
        };

        return await Db
            .SqlQueryAsync<SpRentValueResult>("Exec Sp_RentValue @IdImovel, @IdLocatario, @IdLocador, @DataReferencia",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpExpensesResult>?> GetReportExpenses(
        DateTime dateRefInit,
        DateTime dateRefEnd,
        int? idImovel,
        int? idLocador,
        int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioReferencia", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimReferencia", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true},
            new ("@IdTipoDespesa", SqlDbType.Int)
                {Value = DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpExpensesResult>("Exec Sp_Expenses @DataInicioReferencia, @DataFimReferencia, @IdLocador, @IdLocatario, @IdImovel, @IdTipoDespesa",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpRevenuesResult>?> GetReportRevenues(
        DateTime dateRefInit,
        DateTime dateRefEnd,
        int? idImovel,
        int? idLocador,
        int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioReferencia", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimReferencia", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true},
            new ("@IdTipoDespesa", SqlDbType.Int)
                {Value = DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpRevenuesResult>("Exec Sp_Revenues @DataInicioReferencia, @DataFimReferencia, @IdLocador, @IdLocatario, @IdImovel, @IdTipoDespesa",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpSupplyContractsResult>?> GetReportSupplyContract(
        int? idImovel,
        int? idLocador)
    {
        var parameters = new List<SqlParameter> {
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpSupplyContractsResult>("Exec Sp_SupplyContract @IdImovel, @IdLocador",
                parameters.ToArray());
    }

    public async Task<IEnumerable<dynamic>> GetAllActivePropertTypes()
    {
        var retorno = await Db.Unidade
            .Include(x => x.IdTipoUnidadeNavigation)
            .Select( x=> new
            {
                x.IdTipoUnidadeNavigation.Id,
                x.IdTipoUnidadeNavigation.Nome,
            })
            .Distinct()
            .ToListAsync();

        return retorno;
    }

    public async Task<IEnumerable<dynamic>> GetAllActiveProperties()
    {
        var retorno = await DbSet
            .Include(x => x.ContratoAluguelImovel)
                .ThenInclude(y => y.IdImovelNavigation)
            .Where(x => x.Status
                        && DateTime.Now > x.DataInicioContrato && DateTime.Now < x.DataFimContrato)
            .Select(x => new
            {
                x.ContratoAluguelImovel.First().IdImovelNavigation.Id,
                x.ContratoAluguelImovel.First().IdImovelNavigation.Nome,
            })
            .Distinct()
            .OrderBy(x => x.Nome)
            .ToListAsync();

        return retorno;
    }

    public async Task<IEnumerable<dynamic>> GetAllActiveOwners()
    {
        var retorno = await Db.Imovel
            .Include(x => x.IdClienteProprietarioNavigation)
            .Where(x => x.Status && x.IdClienteProprietarioNavigation.Status)
            .Select(x => new
            {
                x.IdClienteProprietarioNavigation.GuidReferencia,
                x.IdClienteProprietarioNavigation.Id,
                x.IdClienteProprietarioNavigation.Nome
            })
            .Distinct()
            .OrderBy(x => x.Nome)
            .ToListAsync();

        return retorno;
    }
    
    public async Task<IEnumerable<dynamic>> GetActiveRenters()
    {
        var retorno = await DbSet
            .Include(x => x.IdClienteNavigation)
            .Where(x => x.Status && x.IdClienteNavigation.Status)
            .Select(x => new
            {
                x.IdClienteNavigation.GuidReferencia,
                x.IdClienteNavigation.Id,
                x.IdClienteNavigation.Nome
            })
            .Distinct()
            .OrderBy(x => x.Nome)
            .ToListAsync();

        return retorno;
    }

    public async Task<object?> GetUnidadesByContratoAluguel(Guid guid)
    {
        return await DbSet
                        .Include(x => x.ContratoAluguelImovel)
                            .ThenInclude(x => x.ContratoAluguelUnidade)
                        .Where(x => x.GuidReferencia.Equals(guid))
                        .Select(x => new
                        {                            
                            ImovelAlugado = x.ContratoAluguelImovel.Select(x => new
                            {
                                GuidReferencia = x.IdImovelNavigation.GuidReferencia,
                                Nome = x.IdImovelNavigation.Nome,
                                Unidades = x.ContratoAluguelUnidade.Select(y => new
                                {
                                    Ativo = y.IdUnidadeNavigation.Status,
                                    IdUnidade = y.IdUnidadeNavigation.Id,
                                    GuidReferenciaUnidade = y.IdUnidadeNavigation.GuidReferencia,
                                    UnidadeLocada = y.IdUnidadeNavigation.UnidadeLocada
                                }).Where(y => y.Ativo)
                            }),
                        }).ToListAsync();
    }
    
    public async Task<IEnumerable<dynamic>> GetReportDimob(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioReferencia", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimReferencia", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpDimobResult>("Exec Sp_Dimob @DataInicioReferencia, @DataFimReferencia, @IdLocador, @IdLocatario",
                parameters.ToArray());
    }

    public async Task<IEnumerable<dynamic>> GetReportCommercial(DateTime dateRefInit, DateTime dateRefEnd, int? idImovel, int? idLocador, int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioReferencia", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimReferencia", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpCommercialResult>("Exec Sp_Commercial @DataInicioReferencia, @DataFimReferencia, @IdLocador, @IdLocatario, @IdImovel",
                parameters.ToArray());
    }
    
    public async Task<IEnumerable<SpRentContractsResult>?> GetReportRentContract(
        int? idImovel,
        int? idLocador,
        int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpRentContractsResult>("Exec Sp_RentContract @IdImovel, @IdLocador, @IdLocador",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpTotalManagedAreaResult>?> GetDashboardTotalManagedArea(
        DateTime dateRefInit,
        DateTime dateRefEnd,
        int? idLocador)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioReferencia", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimReferencia", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpTotalManagedAreaResult>("Exec Sp_TotalManagedArea @DataInicioReferencia, @DataFimReferencia, @IdLocador",
                parameters.ToArray());
    }
    
    public async Task<IEnumerable<SpTotalManagedAreaStackResult>?> GetDashboardTotalManagedAreaStack(
        DateTime dateRefInit,
        DateTime dateRefEnd,
        int? idLocador)
    {
        var parameters = new List<SqlParameter> {
            new ("@DataInicioReferencia", SqlDbType.Date)
                {Value = dateRefInit},
            new ("@DataFimReferencia", SqlDbType.Date)
                {Value = dateRefEnd},
            new ("@IdLocador", SqlDbType.Int)
                {Value = idLocador.HasValue ? idLocador : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpTotalManagedAreaStackResult>("Exec Sp_TotalManagedAreaStack @DataInicioReferencia, @DataFimReferencia, @IdLocador",
                parameters.ToArray());
    }

}