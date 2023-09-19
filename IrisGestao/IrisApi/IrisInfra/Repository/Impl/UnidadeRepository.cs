using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class UnidadeRepository : Repository<Unidade>, IUnidadeRepository
{
    public UnidadeRepository(IConfiguration configuration, ILogger<Unidade> logger)
        : base(configuration, logger)
    {
    }

    public IEnumerable<Unidade> GetById(int codigo)
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoUnidadeNavigation)
                                .Where(x => x.Id == codigo).ToList();

        return lstUnidades.AsEnumerable();
    }

    public IEnumerable<Unidade> GetAll()
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoUnidadeNavigation).ToList()
                                .Where(x => x.Status);

        return lstUnidades.AsEnumerable();
    }
    public IEnumerable<object?> BuscarUnidadePorImovel(Guid uuid)
    {
        var lstUnidades = DbSet.Include(x => x.IdImovelNavigation)
                                .Include(x => x.IdTipoUnidadeNavigation)
                                .Where(x => x.IdImovelNavigation.GuidReferencia.Equals(uuid)
                                       && x.Status).Select(y => new
                                       {
                                           GuidReferencia = y.GuidReferencia,
                                           IdImovel = y.IdImovel,
                                           AreaUtil = y.AreaUtil,
                                           AreaTotal = y.AreaTotal,
                                           AreaHabitese = y.AreaHabitese,
                                           InscricaoIPTU = y.InscricaoIPTU,
                                           MatriculaEnergia = y.MatriculaEnergia,
                                           Matricula = y.Matricula,
                                           MatriculaAgua = y.MatriculaAgua,
                                           TaxaAdministracao = y.TaxaAdministracao,
                                           ValorPotencial = y.ValorPotencial,
                                           Tipo = y.Tipo,
                                           DataCriacao = y.DataCriacao,
                                           DataUltimaModificacao = y.DataUltimaModificacao,
                                           Ativo = y.Status,
                                           UnidadeLocada = y.UnidadeLocada,
                                           IdTipoUnidadeNavigation = new
                                           {
                                               Id = y.IdTipoUnidadeNavigation.Id,
                                               Nome = y.IdTipoUnidadeNavigation.Nome
                                           },
                                       })
                                .ToList();

        return lstUnidades.AsEnumerable();
    }
    
    public async Task<object?> GetByUid(Guid uid)
    {
        
        return await DbSet
            .Include(x => x.IdImovelNavigation)
                .ThenInclude(y => y.IdCategoriaImovelNavigation)
            .Include(x => x.IdImovelNavigation.IdClienteProprietarioNavigation)
                .ThenInclude(z => z.IdTipoClienteNavigation)
            .Include(x => x.IdTipoUnidadeNavigation)
            .Select(y => new
                {
                    GuidReferencia = y.GuidReferencia,
                    IdImovel = y.IdImovel,
                    AreaUtil = y.AreaUtil,
                    AreaTotal = y.AreaTotal,
                    AreaHabitese = y.AreaHabitese,
                    InscricaoIPTU = y.InscricaoIPTU,
                    MatriculaEnergia = y.MatriculaEnergia,
                    Matricula = y.Matricula,
                    MatriculaAgua = y.MatriculaAgua,
                    TaxaAdministracao = y.TaxaAdministracao,
                    ValorPotencial = y.ValorPotencial,
                    Tipo = y.Tipo,
                    DataCriacao = y.DataCriacao,
                    DataUltimaModificacao = y.DataUltimaModificacao,
                    Ativo = y.Status,
                    UnidadeLocada = y.UnidadeLocada,
                    IdTipoUnidadeNavigation = new
                    {
                        Id = y.IdTipoUnidadeNavigation.Id,
                        Nome = y.IdTipoUnidadeNavigation.Nome
                    },
                    IdImovelNavigation = new
                    {
                        GuidReferencia = y.IdImovelNavigation.GuidReferencia,
                        Nome = y.IdImovelNavigation.Nome,
                        NumCentroCusto = y.IdImovelNavigation.NumCentroCusto,
                        AreaTotal = y.IdImovelNavigation.Unidade.Sum(x => x.AreaTotal),
                        AreaUtil = y.IdImovelNavigation.Unidade.Sum(x => x.AreaUtil),
                        AreaHabitese = y.IdImovelNavigation.Unidade.Sum(x => x.AreaHabitese),
                        NroUnidades = y.IdImovelNavigation.Unidade.Count,
                        IdCategoriaImovelNavigation = new
                        {
                            Id = y.IdImovelNavigation.IdCategoriaImovelNavigation.Id,
                            Nome = y.IdImovelNavigation.IdCategoriaImovelNavigation.Nome
                        },
                        IdClienteProprietarioNavigation = y.IdImovelNavigation.IdClienteProprietarioNavigation == null ? null : new 
                        {
                            GuidReferencia = y.IdImovelNavigation.IdClienteProprietarioNavigation.GuidReferencia,
                            CpfCnpj = y.IdImovelNavigation.IdClienteProprietarioNavigation.CpfCnpj,
                            Nome = y.IdImovelNavigation.IdClienteProprietarioNavigation.Nome,
                            Telefone = y.IdImovelNavigation.IdClienteProprietarioNavigation.Telefone,
                            Email = y.IdImovelNavigation.IdClienteProprietarioNavigation.Email,
                            Cep = y.IdImovelNavigation.IdClienteProprietarioNavigation.Cep,
                            Endereco = y.IdImovelNavigation.IdClienteProprietarioNavigation.Endereco,
                            Bairro = y.IdImovelNavigation.IdClienteProprietarioNavigation.Bairro,
                            Cidade = y.IdImovelNavigation.IdClienteProprietarioNavigation.Cidade,
                            Estado = y.IdImovelNavigation.IdClienteProprietarioNavigation.Estado,
                            IdTipoClienteNavigation = y.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation == null
                                ? null
                                : new 
                                {
                                    Id = y.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Id,
                                    Nome = y.IdImovelNavigation.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Nome,
                                }
                        }
                    }
                })
            .FirstOrDefaultAsync(x => x.GuidReferencia.ToUpper().Equals(uid.ToString().ToUpper()));
    }
    
    public async Task<Unidade?> GetByReferenceGuid(Guid uid)
    {
        return await DbSet
            .FirstOrDefaultAsync(x => x.GuidReferencia.ToUpper().Equals(uid.ToString().ToUpper()));
    }

    public async Task<object> GetUnidadesLivresByImoveis(Guid uid, List<string> unidades)
    {
        var result = Db.Unidade
            .Where(u => (!u.UnidadeLocada || (unidades != null && unidades.Contains(u.GuidReferencia)))
                && (u.Status)
                && (u.IdImovelNavigation.Status)
                && (u.IdImovelNavigation.GuidReferencia.Equals(uid))
                && (u.IdImovelNavigation.IdCategoriaImovel.Equals(TipoImovelEnum.IMOVEL_CARTEIRA)))
            .Select(u => new
            {
                tipo = u.Tipo,
                guidReferencia = u.GuidReferencia,
            }).OrderBy(u => u.tipo)
            .ToList();

        return result;
    }
}