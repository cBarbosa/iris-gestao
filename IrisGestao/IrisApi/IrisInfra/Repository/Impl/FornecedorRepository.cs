using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class FornecedorRepository : Repository<Fornecedor>, IFornecedorRepository
{
    public FornecedorRepository(IConfiguration configuration, ILogger<Fornecedor> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<Fornecedor?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet
            .FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<object?> GetByGuid(Guid guid)
    {
        return await DbSet
                        .Include(x => x.IdDadoBancarioNavigation)
                        .ThenInclude(x => x.IdBancoNavigation)
                        .Include(z=> z.Contato)
                        .Where(x => x.GuidReferencia.Equals(guid))
                        .Select(x => new
                        {
                            GuidReferencia          = x.GuidReferencia,
                            Nome                    = x.Nome,
                            CpfCnpj                 = x.CpfCnpj,
                            RazaoSocial             = x.RazaoSocial,
                            DataUltimaModificacao   = x.DataUltimaModificacao,
                            DataCriacao             = x.DataCriacao,
                            cep                     = x.Cep,
                            endereco                = x.Endereco,
                            bairro                  = x.Bairro,
                            cidade                  = x.Cidade,
                            estado                  = x.Estado,
                            telefone                = x.Telefone,
                            email                   = x.Email,
                            DadoBancario            = x.IdDadoBancarioNavigation == null ? null : new
                            {
                                IdBanco               = x.IdDadoBancarioNavigation.IdBanco,
                                Agencia               = x.IdDadoBancarioNavigation.Agencia,
                                Operacao              = x.IdDadoBancarioNavigation.Operacao,
                                Conta                 = x.IdDadoBancarioNavigation.Conta,
                                ChavePix              = x.IdDadoBancarioNavigation.ChavePix,
                                DataCriacao           = x.IdDadoBancarioNavigation.DataCriacao,
                                Banco                 = x.IdDadoBancarioNavigation.Banco.Equals("Transit") ?
                                    x.IdDadoBancarioNavigation.IdBancoNavigation.Descricao :
                                    x.IdDadoBancarioNavigation.Banco,
                                BancoNavigation = x.IdDadoBancarioNavigation.IdBancoNavigation == null ? null : new
                                {
                                    Codigo = x.IdDadoBancarioNavigation.IdBancoNavigation.Codigo,
                                    Descricao = x.IdDadoBancarioNavigation.IdBancoNavigation.Descricao,
                                }
                            },
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
                            }),
                            Contratos = x.ContratoFornecedor.Select(x => new
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
                                TipodeServico = x.IdTipoServicoNavigation == null ? null : new
                                {
                                    Id = x.IdTipoServicoNavigation.Id,
                                    Nome = x.IdTipoServicoNavigation.Nome
                                },
                            })
                        })
                        .FirstOrDefaultAsync();
    }

    public async Task<CommandPagingResult?> GetAllPaging(string? nome, int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var Fornecedors = await DbSet
                .Include(x => x.IdDadoBancarioNavigation)
                .Where(x =>
                        (!string.IsNullOrEmpty(nome)
                            ? x.Nome.Contains(nome)
                            : true)
                            && (x.Status.Value)
                    )
                .OrderBy(x => x.Nome)
                .ToListAsync();

            var totalCount = Fornecedors.Where(x => x.Status.Value).Count();

            var FornecedorsPaging = Fornecedors.Skip(skip).Take(limit);

            if (FornecedorsPaging.Any())
                return new CommandPagingResult(FornecedorsPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, ex.Message);
        }

        return null!;
    }
}