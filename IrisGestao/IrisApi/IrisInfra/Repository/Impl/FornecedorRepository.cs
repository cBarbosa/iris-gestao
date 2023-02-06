using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
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
                            DadoBancario            = x.IdDadoBancarioNavigation == null ? null : new
                            {
                                Agencia               = x.IdDadoBancarioNavigation.Agencia,
                                Operacao              = x.IdDadoBancarioNavigation.Operacao,
                                DadoBancario          = x.IdDadoBancarioNavigation.Banco,
                                Conta                 = x.IdDadoBancarioNavigation.Conta,
                                ChavePix              = x.IdDadoBancarioNavigation.ChavePix,
                                DataCriacao           = x.IdDadoBancarioNavigation.DataCriacao,
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
                            && (x.Status)
                    )
                .OrderBy(x => x.Nome)
                .ToListAsync();

            var totalCount = Fornecedors.Where(x => x.Status).Count();

            var FornecedorsPaging = Fornecedors.Skip(skip).Take(limit);

            if (FornecedorsPaging.Any())
                return new CommandPagingResult(FornecedorsPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message);
        }

        return null!;
    }
}