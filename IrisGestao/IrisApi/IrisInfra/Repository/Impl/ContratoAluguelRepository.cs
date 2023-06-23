using System.Collections;
using System.Data;
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

    public async Task<object> GetDashboardTotalManagedArea(int? idLocador, int? idTipoImovel)
    {
        try
        {
            return await Db.Unidade
                .Include(u => u.IdImovelNavigation)
                    .ThenInclude(i => i.IdClienteProprietarioNavigation)
                .Where(u => (!idLocador.HasValue || idLocador.HasValue && u.IdImovelNavigation.IdClienteProprietario == idLocador)
                             && (!idTipoImovel.HasValue || idTipoImovel.HasValue && u.IdTipoUnidade == idTipoImovel)
                            )
                .GroupBy(
                    u => u.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
                    (key, group) => new {
                        Percent = Math.Round((decimal)group.Count() * 100 / Db.Unidade
                            .Count(x => !idTipoImovel.HasValue || idTipoImovel.HasValue && x.IdTipoUnidade == idTipoImovel), 2),
                        Title = key,
                        Color = $"#{new Random().Next(0x1000000):X6}"
                    })
                .OrderByDescending(r => r.Percent)
                .Select(r => new {
                    r.Percent,
                    r.Title,
                    r.Color
                })
                .ToListAsync();
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }
        return null!;
    }
    
    public async Task<object> GetDashbaordFinancialVacancy(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel)
    {
        var Meses = Enumerable.Range(0, int.MaxValue)
            .Select(dateRefInit.AddMonths)
            .TakeWhile(date => date <= dateRefEnd)
            .Select(date => new { DataMes = date });

        try
        {
            var query = Meses
                .SelectMany(mes => Db.ContratoAluguel
                    .Where(contrato => mes.DataMes >= contrato.DataInicioContrato && mes.DataMes <= contrato.DataFimContrato && contrato.Status
                        && (!idLocador.HasValue || idLocador.HasValue && contrato.IdCliente == idLocador)
                        // && (!idTipoImovel.HasValue || idTipoImovel.HasValue && contrato != null && contrato.ContratoAluguelImovel.Where(x => x.ContratoAluguelUnidade.Where(z => z.IdUnidadeNavigation != null && z.IdUnidadeNavigation != null && z.IdUnidadeNavigation.IdTipoUnidade == idTipoImovel) != null ) != null )
                    )
                    .Include(contrato => contrato.IdClienteNavigation)
                    .Include(contrato => contrato.ContratoAluguelImovel)
                        .ThenInclude(x => x.ContratoAluguelUnidade)
                            .ThenInclude(x => x.IdUnidadeNavigation)
                    .Include(x => x.ContratoAluguelImovel)
                        .ThenInclude(x => x.IdImovelNavigation)
                            .ThenInclude(x => x.IdClienteProprietarioNavigation)
                    .DefaultIfEmpty()
                    .Select(x => new {Mes = mes, Contrato = x})
                )
                .GroupBy(x => new
                {
                    Referencia = x.Mes.DataMes.Month.ToString("00") + "-" + x.Mes.DataMes.Year.ToString("0000")
                })
                .OrderBy(groupedData => groupedData.Key.Referencia)
                .Select(groupedData => new
                {
                    groupedData.Key.Referencia,
                    Potencial = groupedData.Sum(x => x.Contrato != null ? x.Contrato.ValorAluguel : 0.0),
                    Contratada = groupedData.Where(x => x.Contrato != null && x.Contrato.Status)?.Sum(x => x.Contrato != null ? x.Contrato.ValorAluguel : 0.0),
                    Financeira = groupedData.Where(x => x.Contrato != null && x.Contrato.Status)?.Sum(x => x.Contrato != null ? x.Contrato.ValorAluguel : 0.0) / groupedData.Sum(x => x.Contrato != null ? x.Contrato.ValorAluguel : 1.0)
                })
                .ToList();

            return await Task.FromResult(query);
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }

        return null!;
    }
    
    public async Task<object> GetDashbaordPhysicalVacancy(DateTime dateRefInit, DateTime dateRefEnd, int? idLocador, int? idTipoImovel)
    {
        var Meses = Enumerable.Range(0, int.MaxValue)
            .Select(dateRefInit.AddMonths)
            .TakeWhile(date => date <= dateRefEnd)
            .Select(date => new { DataMes = date });

        try
        {
            var query = Meses
                .SelectMany(mes => Db.ContratoAluguel
                    .Where(contrato => mes.DataMes >= contrato.DataInicioContrato && mes.DataMes <= contrato.DataFimContrato && contrato.Status
                        && (!idLocador.HasValue || idLocador.HasValue && contrato.IdCliente == idLocador)
                        // && (!idTipoImovel.HasValue || idTipoImovel.HasValue && contrato.ContratoAluguelImovel.Where(x => x.ContratoAluguelUnidade.Where(z => z.IdUnidadeNavigation.IdTipoUnidade == idTipoImovel)))
                    )
                    .Include(contrato => contrato.IdClienteNavigation)
                    .Include(contrato => contrato.ContratoAluguelImovel)
                        .ThenInclude(x => x.ContratoAluguelUnidade)
                            .ThenInclude(x => x.IdUnidadeNavigation)
                    .Include(x => x.ContratoAluguelImovel)
                        .ThenInclude(x => x.IdImovelNavigation)
                            .ThenInclude(x => x.IdClienteProprietarioNavigation)
                    .DefaultIfEmpty()
                    .Select(x => new {Mes = mes, Contrato = x})
                )
                .GroupBy(x => new
                {
                    Referencia = x.Mes.DataMes.Month.ToString("00") + "-" + x.Mes.DataMes.Year.ToString("0000")
                })
                .OrderBy(groupedData => groupedData.Key.Referencia)
                .Select(groupedData => new
                {
                    groupedData.Key.Referencia,
                    Potencial = groupedData.Sum(x =>  x.Contrato?.ContratoAluguelImovel?.Sum(y => y.ContratoAluguelUnidade?.Sum(z => z.IdUnidadeNavigation?.AreaUtil))),
                    Contratada = groupedData.Where(x => x.Contrato != null && x.Contrato.Status)?.Sum(x =>  x.Contrato?.ContratoAluguelImovel?.Sum(y => y.ContratoAluguelUnidade?.Sum(z => z.IdUnidadeNavigation?.AreaUtil))),
                    Financeira = groupedData.Where(x => x.Contrato != null && x.Contrato.Status)?.Sum(x =>  x.Contrato?.ContratoAluguelImovel?.Sum(y => y.ContratoAluguelUnidade?.Sum(z => z.IdUnidadeNavigation?.AreaUtil)))
                        / (groupedData.Sum(x =>  x.Contrato?.ContratoAluguelImovel?.Sum(y => y.ContratoAluguelUnidade?.Sum(z => z.IdUnidadeNavigation?.AreaUtil))) > 0
                                 ? groupedData.Sum(x =>  x.Contrato?.ContratoAluguelImovel?.Sum(y => y.ContratoAluguelUnidade?.Sum(z => z.IdUnidadeNavigation?.AreaUtil)))
                                 : 1.0m)
                })
                .ToList();

            return await Task.FromResult(query);
        }
        catch (Exception e)
        {
            Logger.LogError(e, e.Message);
        }

        return null!;
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
        bool? status,
        int? idImovel,
        int? idTipoImovel,
        int? idLocador,
        int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@Status", SqlDbType.Bit)
                {Value = status.HasValue ? status : DBNull.Value, IsNullable = true},
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdTipoImovel", SqlDbType.Int)
                {Value = idTipoImovel.HasValue ? idTipoImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpLeasedAreaResult>("Exec Sp_LeasedArea @Status, @IdImovel, @IdTipoImovel, @IdLocatario",
                parameters.ToArray());
    }

    public async Task<IEnumerable<SpRentValueResult>?> GetReportRentValue(
        bool? status,
        int? idImovel,
        int? idTipoImovel,
        int? idLocador,
        int? idLocatario)
    {
        var parameters = new List<SqlParameter> {
            new ("@Status", SqlDbType.Bit)
                {Value = status.HasValue ? status : DBNull.Value, IsNullable = true},
            new ("@IdImovel", SqlDbType.Int)
                {Value = idImovel.HasValue ? idImovel : DBNull.Value, IsNullable = true},
            new ("@IdTipoImovel", SqlDbType.Int)
                {Value = idTipoImovel.HasValue ? idTipoImovel : DBNull.Value, IsNullable = true},
            new ("@IdLocatario", SqlDbType.Int)
                {Value = idLocatario.HasValue ? idLocatario : DBNull.Value, IsNullable = true}
        };

        return await Db
            .SqlQueryAsync<SpRentValueResult>("Exec Sp_RentValue @Status, @IdImovel, @IdTipoImovel, @IdLocatario",
                parameters.ToArray());
    }
}

