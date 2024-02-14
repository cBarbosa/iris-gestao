using Azure;
using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ImovelRepository : Repository<Imovel>, IImovelRepository
{
    public ImovelRepository(IConfiguration configuration, ILogger<Imovel> logger)
        : base(configuration, logger)
    {
        
    }

    public async Task<IEnumerable<Imovel>> GetById(int id)
    {
        return await  DbSet
                .Include(x => x.Unidade)
                .Include(x => x.IdClienteProprietarioNavigation)
                .Include(x => x.IdCategoriaImovelNavigation)
            .Where(x => x.Id == id)
            .ToListAsync();
    }

    public async Task<CommandPagingResult?> GetAllPaging(int? idCategoria, int? idTipoImovel, int? idProprietario, string? nome, int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var imoveis = await DbSet
                        .Include(x => x.IdClienteProprietarioNavigation)
                            .ThenInclude(y => y.IdTipoClienteNavigation)
                        .Include(x => x.IdCategoriaImovelNavigation)
                        .Include(x => x.ImovelEndereco)
                        .Include(x => x.Unidade)
                            .ThenInclude(y => y.IdTipoUnidadeNavigation)
                        .Where(x => x.Status
                                    && (idTipoImovel.HasValue
                                        ? x.IdCategoriaImovel.Equals(idTipoImovel.Value)
                                        : true)
                                    && (idCategoria.HasValue
                                        ? x.Unidade.FirstOrDefault(y => y.IdTipoUnidade.Equals(idCategoria.Value)) != null
                                        : true)
                                    && (idProprietario.HasValue
                                        ? x.IdClienteProprietario.Equals(idProprietario.Value)
                                        : true)
                                    && (!string.IsNullOrEmpty(nome)
                                        ? x.Nome.Contains(nome!)
                                        : true)
                            )
                        .Select(x => new
                        {
                            GuidReferencia = x.GuidReferencia,
                            Nome = x.Nome,
                            NumCentroCusto = x.NumCentroCusto,
                            ImovelEndereco = x.ImovelEndereco,
                            Status          = x.Status,
                            Unidade = x.Unidade.Select(y => new
                                {
                                    GuidReferencia = y.GuidReferencia,
                                    IdImovel = y.IdImovel,
                                    AreaUtil = y.AreaUtil,
                                    AreaTotal = y.AreaTotal,
                                    AreaHabitese = y.AreaHabitese,
                                    InscricaoIPTU = y.InscricaoIPTU,
                                    Matricula = y.Matricula,
                                    MatriculaEnergia = y.MatriculaEnergia,
                                    MatriculaAgua = y.MatriculaAgua,
                                    TaxaAdministracao = y.TaxaAdministracao,
                                    Tipo = y.Tipo,
                                    ValorPotencial = y.ValorPotencial,
                                    DataCriacao = y.DataCriacao,
                                    DataUltimaModificacao = y.DataUltimaModificacao,
                                    Ativo = y.Status,
                                    IdTipoUnidadeNavigation = new
                                    {
                                        Id = y.IdTipoUnidadeNavigation.Id,
                                        Nome = y.IdTipoUnidadeNavigation.Nome
                                    }
                                }
                                ).Where(y => y.Ativo),
                            AreaTotal = x.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                            AreaUtil = x.Unidade.Where(x=> x.Status).Sum(x => x.AreaUtil),
                            AreaHabitese = x.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                            NroUnidades = x.Unidade.Where(x => x.Status).Count(),
                            IdCategoriaImovelNavigation = x.IdCategoriaImovelNavigation == null ? null : new 
                            {
                                Id = x.IdCategoriaImovelNavigation.Id,
                                Nome = x.IdCategoriaImovelNavigation.Nome
                            },
                            IdClienteProprietarioNavigation = x.IdClienteProprietarioNavigation == null ? null : new 
                            {
                                Id = x.IdClienteProprietarioNavigation.Id,
                                GuidReferencia = x.IdClienteProprietarioNavigation.GuidReferencia,
                                CpfCnpj = x.IdClienteProprietarioNavigation.CpfCnpj,
                                Nome = x.IdClienteProprietarioNavigation.Nome,
                                Telefone = x.IdClienteProprietarioNavigation.Telefone,
                                Email = x.IdClienteProprietarioNavigation.Email,
                                Cep = x.IdClienteProprietarioNavigation.Cep,
                                Endereco = x.IdClienteProprietarioNavigation.Endereco,
                                Bairro = x.IdClienteProprietarioNavigation.Bairro,
                                Cidade = x.IdClienteProprietarioNavigation.Cidade,
                                Estado = x.IdClienteProprietarioNavigation.Estado,
                                IdTipoClienteNavigation = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation == null
                                    ? null
                                    : new 
                                    {
                                        Id = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Id,
                                        Nome = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Nome,
                                    }
                            }
                        })
                    .ToListAsync();

            var totalCount = imoveis.Count();

            var imoveisPaging = imoveis.Skip(skip).Take(limit);

            if (imoveisPaging.Any())
                return new CommandPagingResult(imoveisPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message);
        }

        return null!;
    }

    public async Task<object?> GetByGuid(Guid guid)
    {
        return await DbSet
                        .Include(x => x.IdClienteProprietarioNavigation)
                            .ThenInclude(y => y.IdTipoClienteNavigation)
                        .Include(x => x.IdCategoriaImovelNavigation)
                        .Include(x => x.ImovelEndereco)
                        .Include(x => x.Unidade)
                            .ThenInclude(y => y.IdTipoUnidadeNavigation)
                        .Include(x => x.Evento)
                        .Where(x => x.GuidReferencia.Equals(guid))
                        .Select(x => new
                        {
                            GuidReferencia = x.GuidReferencia,
                            Nome = x.Nome,
                            NumCentroCusto = x.NumCentroCusto,
                            ImovelEndereco = x.ImovelEndereco,
                            Unidade = x.Unidade.Select(y => new
                            {
                                GuidReferencia = y.GuidReferencia,
                                IdImovel = y.IdImovel,
                                AreaUtil = y.AreaUtil,
                                AreaTotal = y.AreaTotal,
                                AreaHabitese = y.AreaHabitese,
                                InscricaoIPTU = y.InscricaoIPTU,
                                Matricula = y.Matricula,
                                MatriculaEnergia = y.MatriculaEnergia,
                                MatriculaAgua = y.MatriculaAgua,
                                TaxaAdministracao = y.TaxaAdministracao,
                                ValorPotencial = y.ValorPotencial,
                                Tipo = y.Tipo,
                                DataCriacao = y.DataCriacao,
                                DataUltimaModificacao = y.DataUltimaModificacao,
                                UnidadeLocada = y.UnidadeLocada,
                                Ativo = y.Status,
                                Locatario = y.ContratoAluguelUnidade.Where(alU => alU.IdUnidade == y.Id && y.UnidadeLocada).FirstOrDefault()
                                .IdContratoAluguelImovelNavigation.IdContratoAluguelNavigation.IdClienteNavigation.Nome,
                                DataVencimentoContrato = y.ContratoAluguelUnidade.Where(alU => alU.IdUnidade == y.Id && y.UnidadeLocada).FirstOrDefault()
                                .IdContratoAluguelImovelNavigation.IdContratoAluguelNavigation.DataFimContrato.ToString("dd/MM/yyyy"),
                                IdTipoUnidadeNavigation = new
                                {
                                    Id = y.IdTipoUnidadeNavigation.Id,
                                    Nome = y.IdTipoUnidadeNavigation.Nome
                                }
                            }).Where(y => y.Ativo).OrderBy(x=> x.Tipo).ToList(),
                            AreaTotal = x.Unidade.Where(x => x.Status).Sum(x => x.AreaTotal),
                            AreaUtil = x.Unidade.Where(x => x.Status).Sum(x => x.AreaUtil),
                            AreaHabitese = x.Unidade.Where(x => x.Status).Sum(x => x.AreaHabitese),
                            NroUnidades = x.Unidade.Where(x => x.Status).Count(),
                            IdCategoriaImovelNavigation = x.IdCategoriaImovelNavigation == null ? null : new 
                            {
                                Id = x.IdCategoriaImovelNavigation.Id,
                                Nome = x.IdCategoriaImovelNavigation.Nome
                            },
                            IdClienteProprietarioNavigation = x.IdClienteProprietarioNavigation == null ? null : new 
                            {
                                Id = x.IdClienteProprietarioNavigation.Id,
                                GuidReferencia = x.IdClienteProprietarioNavigation.GuidReferencia,
                                CpfCnpj = x.IdClienteProprietarioNavigation.CpfCnpj,
                                Nome = x.IdClienteProprietarioNavigation.Nome,
                                Telefone = x.IdClienteProprietarioNavigation.Telefone,
                                Email = x.IdClienteProprietarioNavigation.Email,
                                Cep = x.IdClienteProprietarioNavigation.Cep,
                                Endereco = x.IdClienteProprietarioNavigation.Endereco,
                                Bairro = x.IdClienteProprietarioNavigation.Bairro,
                                Cidade = x.IdClienteProprietarioNavigation.Cidade,
                                Estado = x.IdClienteProprietarioNavigation.Estado,
                                IdTipoClienteNavigation = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation == null
                                    ? null
                                    : new 
                                    {
                                        Id = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Id,
                                        Nome = x.IdClienteProprietarioNavigation.IdTipoClienteNavigation.Nome,
                                    }
                            },
                            Eventos = x.Evento.Select(y => new
                            {
                                GuidReferenciaEvento = y.GuidReferencia,
                                DataRealizacao = y.DthRealizacao.HasValue ? y.DthRealizacao.Value.ToString("dd/MM/yyyy") : "",
                                Nome           = y.Nome,
                                Descricao = y.Descricao,
                                TipoEvento = y.TipoEvento,
                                ClienteVisitante = y.IdClienteNavigation == null
                                    ? null
                                    : new
                                    {
                                        GuidReferenciaVisitante = y.IdClienteNavigation.GuidReferencia,
                                        Nome = y.IdClienteNavigation.Nome
                                    },
                                UnidadesVisitadas = y.EventoUnidade.Select(y => new
                                {
                                    GuidReferenciaUnidadeVisitada = y.IdUnidadeNavigation.GuidReferencia,
                                    Tipo = y.IdUnidadeNavigation.Tipo
                                })
                            }),
                        })
                    .FirstOrDefaultAsync();
    }
    
    public async Task<Imovel?> GetByReferenceGuid(Guid guid)
    {
        return await DbSet
            .FirstOrDefaultAsync(x => x.GuidReferencia.Equals(guid));
    }
    
    public async Task<object> GetImoveisParaContrato()
    {
        var result = Db.Unidade
            .Where(u => !u.UnidadeLocada
                && (u.Status)
                && (u.IdImovelNavigation.Status)
                && (u.IdImovelNavigation.IdCategoriaImovel.Equals(TipoImovelEnum.IMOVEL_CARTEIRA)))
            .Select(u => new
            {
                IdImovel = u.IdImovelNavigation.Id,
                NomeImovel = u.IdImovelNavigation.Nome,
                GuidImovel = u.IdImovelNavigation.GuidReferencia,
                NomeUnidade = u.Tipo,
                GuidReferenciaUnidade = u.GuidReferencia,
            }).OrderBy(x => x.NomeImovel).OrderBy(x=> x.NomeUnidade)
            .ToList();

        return result;
    }
}
