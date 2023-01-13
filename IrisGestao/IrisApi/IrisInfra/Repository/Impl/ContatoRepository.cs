using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContatoRepository: Repository<Contato>, IContatoRepository
{
    public ContatoRepository(IConfiguration configuration, ILogger<Contato> logger)
        : base(configuration, logger)
    {
        
    }
    public async Task<Contato?> GetByGuid(Guid guid)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }

    public async Task<object?> GetByClienteId(int id)
    {
        return await DbSet
                        .Include(y => y.IdClienteNavigation)
                            .ThenInclude(y=> y.IdTipoClienteNavigation)
                        .Where(x => x.IdCliente.Equals(id))
                        .Select(x => new
                        {
                            Nome                    = x.Nome,
                            Cargo                   = x.Cargo,
                            Email                   = x.Email,
                            Telefone                = x.Telefone,
                            DataNascimento          = x.DataNascimento,
                            DataCriacao             = x.DataCriacao,
                            DataAtualização         = x.DataUltimaModificacao,
                            GuidReferencia          = x.GuidReferencia.HasValue ? x.GuidReferencia.Value : Guid.Empty,
                            /*IdClienteNavigation     = x.IdClienteNavigation == null ? null : new
                            {
                                CpfCnpj                 = x.IdClienteNavigation.CpfCnpj,
                                GuidReferencia          = x.IdClienteNavigation.GuidReferencia,
                                Nome                    = x.IdClienteNavigation.Nome,
                                RazaoSocial             = x.IdClienteNavigation.RazaoSocial,
                                Email                   = x.IdClienteNavigation.Email,
                                Telefone                = x.IdClienteNavigation.Telefone,
                                dataNascimento          = x.IdClienteNavigation.DataNascimento,
                                IdTipoCliente           = x.IdClienteNavigation.IdTipoCliente,
                                DataUltimaModificacao   = x.IdClienteNavigation.DataUltimaModificacao,
                                cep                     = x.IdClienteNavigation.Cep,
                                endereco                = x.IdClienteNavigation.Endereco,
                                bairro                  = x.IdClienteNavigation.Bairro,
                                cidade                  = x.IdClienteNavigation.Cidade,
                                estado                  = x.IdClienteNavigation.Estado,
                                IdTipoClienteNavigation = x.IdClienteNavigation.IdTipoClienteNavigation == null
                                    ? null
                                    : new
                                    {
                                        Id = x.IdClienteNavigation.IdTipoClienteNavigation.Id,
                                        Nome = x.IdClienteNavigation.IdTipoClienteNavigation.Nome,
                                    }
                            }*/
                        }).ToListAsync();
    }
}