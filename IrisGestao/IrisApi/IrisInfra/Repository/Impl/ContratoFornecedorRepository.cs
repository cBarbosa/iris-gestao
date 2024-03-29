﻿using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography.X509Certificates;

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
                            DataVencimentoPrimeraParcela = x.DataVencimentoPrimeraParcela,
                            DiaPagamento = x.DataVencimentoPrimeraParcela.HasValue ? x.DataVencimentoPrimeraParcela.Value.Day : x.DiaPagamento,
                            PeriodicidadeReajuste = x.PeriodicidadeReajuste,
                            GuidReferencia = x.GuidReferencia,
                            DataCriacao = x.DataCriacao,
                            DataAtualização = x.DataUltimaModificacao,
                            Status = x.Status,
                            DescricaoServico = x.DescricaoServico,
                            ExibirAlertaVencimento = (x.DataFimContrato - DateTime.Now).Days <= 90 ? true : false,
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
                                IdClienteProprietarioNavigation = x.IdImovelNavigation.IdClienteProprietarioNavigation == null ? null : new
                                {
                                     CpfCnpj = x.IdImovelNavigation.IdClienteProprietarioNavigation.CpfCnpj,
                                    Nome = x.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
                                    Telefone = x.IdImovelNavigation.IdClienteProprietarioNavigation.Telefone
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
                                GuidReferencia = x.IdFornecedorNavigation.GuidReferencia,
                                Nome = x.IdFornecedorNavigation.Nome,
                                CpfCnpj = x.IdFornecedorNavigation.CpfCnpj,
                                RazaoSocial = x.IdFornecedorNavigation.RazaoSocial,
                                DataUltimaModificacao = x.IdFornecedorNavigation.DataUltimaModificacao,
                                DataCriacao = x.IdFornecedorNavigation.DataCriacao,
                                cep = x.IdFornecedorNavigation.Cep,
                                endereco = x.IdFornecedorNavigation.Endereco,
                                bairro = x.IdFornecedorNavigation.Bairro,
                                cidade = x.IdFornecedorNavigation.Cidade,
                                estado = x.IdFornecedorNavigation.Estado,
                                DadoBancario = x.IdFornecedorNavigation.IdDadoBancarioNavigation == null ? null : new
                                {
                                    Agencia = x.IdFornecedorNavigation.IdDadoBancarioNavigation.Agencia,
                                    Operacao = x.IdFornecedorNavigation.IdDadoBancarioNavigation.Operacao,
                                    DadoBancario = x.IdFornecedorNavigation.IdDadoBancarioNavigation.Banco,
                                    Conta = x.IdFornecedorNavigation.IdDadoBancarioNavigation.Conta,
                                    ChavePix = x.IdFornecedorNavigation.IdDadoBancarioNavigation.ChavePix,
                                    DataCriacao = x.IdFornecedorNavigation.IdDadoBancarioNavigation.DataCriacao,
                                },
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
                        .Include(x => x.IdFornecedorNavigation)
                        .Include( x=> x.IdImovelNavigation)
                        .Where(x => x.Status
                                    && (!string.IsNullOrEmpty(numeroContrato)
                                        ? x.NumeroContrato.Contains(numeroContrato!)
                                        : true))
                        .Select(x => new
                        {
                            NumeroContrato                  = x.NumeroContrato,
                            Percentual                      = x.Percentual,
                            DataAtualizacao                 = x.DataAtualizacao,
                            ValorServicoContratado          = x.ValorServicoContratado,
                            DataInicioContrato              = x.DataInicioContrato,
                            PrazoTotalMeses                 = x.PrazoTotalMeses,
                            DataFimContrato                 = x.DataFimContrato,
                            DiaPagamento                    = x.DataVencimentoPrimeraParcela.HasValue ? x.DataVencimentoPrimeraParcela.Value.Day : x.DiaPagamento,
                            DataVencimentoPrimeraParcela    = x.DataVencimentoPrimeraParcela,
                            PeriodicidadeReajuste           = x.PeriodicidadeReajuste,
                            GuidReferencia                  = x.GuidReferencia,
                            DataCriacao                     = x.DataCriacao,
                            DataAtualização                 = x.DataUltimaModificacao,
                            Status                          = x.Status,
                            DescricaoServico                = x.DescricaoServico,
                            ExibirAlertaVencimento          = (x.DataFimContrato - DateTime.Now).Days <= 90 ? true : false,
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
                            Imovel = x.IdImovelNavigation == null ? null : new
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
                                Proprietario = x.IdImovelNavigation.IdClienteProprietarioNavigation == null ? null : new
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
                            },
                        }).OrderByDescending(x => x.DataCriacao).ToListAsync();

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