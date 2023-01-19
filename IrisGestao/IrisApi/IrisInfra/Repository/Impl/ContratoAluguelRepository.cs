using IrisGestao.ApplicationService.Repository.Interfaces;
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
                        .Include(imb => imb.IdImovelNavigation)
                            .ThenInclude(imb => imb.IdCategoriaImovelNavigation)
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
                            IdClienteNavigation     = x.IdClienteNavigation == null ? null : new
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
                            }
                        }).ToListAsync();
    }
}