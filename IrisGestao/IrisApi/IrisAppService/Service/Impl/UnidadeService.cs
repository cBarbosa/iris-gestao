using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class UnidadeService: IUnidadeService
{
    private readonly IUnidadeRepository unidadeRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly ILogger<UnidadeService> logger;
    
    public UnidadeService(
        IUnidadeRepository unidadeRepository
        , IImovelRepository imovelRepository
        , ILogger<UnidadeService> logger)
    {
        this.unidadeRepository = unidadeRepository;
        this.imovelRepository = imovelRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAll()
    {
        var Unidades = await Task.FromResult(unidadeRepository.GetAll());

        return !Unidades.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Unidades);
    }

    public async Task<CommandResult> GetById(int codigo)
    {
        var Unidade = await Task.FromResult(unidadeRepository.GetById(codigo));

        return Unidade == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Unidade);
    }

    public async Task<CommandResult> BuscarBuscarUnidadePorImovel(int codigoImovel)
    {

        var Unidades = await Task.FromResult(unidadeRepository.BuscarUnidadePorImovel(codigoImovel));

        return !Unidades.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Unidades);
    }

    public async Task<CommandResult> GetByUid(Guid guid)
    {
        var unidade = await unidadeRepository.GetByUid(guid);

        return unidade == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, unidade);
    }

    public async Task<CommandResult> Insert(Guid guidImovel, CriarUnidadeCommand cmd)
    {
        if (guidImovel.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        
        var imovel = await imovelRepository.GetByReferenceGuid(guidImovel);
            
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }

        cmd.GuidReferencia = Guid.Empty;
        try
        {
            if (!cmd.QtdeCopias.HasValue
                || cmd.IdTipoUnidade.Equals(TipoUnidadeEnum.PAVIMENTO_CORPORATIVO))
            {
                await CriaVariasUnidades(1, cmd, imovel);
            }
            else
            {
                await CriaVariasUnidades(cmd.QtdeCopias ?? 1, cmd, imovel);
            }

            return new CommandResult(true,
                SuccessResponseEnums.Success_1000,
                $"{cmd.QtdeCopias ?? 1} unidades cadastradas com sucesso");
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid guid, CriarUnidadeCommand cmd)
    {
        if (guid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var unidade = await unidadeRepository.GetByReferenceGuid(guid);

        if (unidade == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cmd.GuidReferencia = guid;
        BindUnidadeData(cmd, unidade);

        try
        {
            unidadeRepository.Update(unidade);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, unidade);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> Delete(int? codigo)
    {
        if (!codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        else
        {
            var _unidade = await Task.FromResult(unidadeRepository.GetById(codigo.Value));

            if(_unidade == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                unidadeRepository.Delete(codigo.Value);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
                throw;
            }
        }
    }

    public async Task<CommandResult> AlterarStatus(Guid guid, bool status)
    {
        if (guid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var unidade = await unidadeRepository.GetByReferenceGuid(guid);

        if (unidade == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        unidade.Status = status;

        try
        {
            unidadeRepository.Update(unidade);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, unidade);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> Clone(Guid guid)
    {
        var _unidade = await unidadeRepository.GetByReferenceGuid(guid);

        if (_unidade == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }

        try
        {
            var unidade = new Unidade
            {
                GuidReferencia = $"{Guid.NewGuid()}",
                Tipo = $"{_unidade.Tipo} 01",
                IdImovel = _unidade.IdImovel,
                DataCriacao = DateTime.Now,
                IdTipoUnidade = _unidade.IdTipoUnidade,
                AreaUtil = _unidade.AreaUtil,
                AreaTotal = _unidade.AreaTotal,
                AreaHabitese = _unidade.AreaHabitese,
                InscricaoIPTU = _unidade.InscricaoIPTU,
                Matricula = _unidade.Matricula,
                MatriculaEnergia = _unidade.MatriculaEnergia,
                MatriculaAgua = _unidade.MatriculaAgua,
                TaxaAdministracao = _unidade.TaxaAdministracao,
                ValorPotencial = _unidade.ValorPotencial,
                UnidadeLocada = _unidade.UnidadeLocada,
                Status = true
            };

            unidadeRepository.Insert(unidade);
        
            return new CommandResult(true, SuccessResponseEnums.Success_1000, unidade);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }
    
    private static void BindUnidadeData(CriarUnidadeCommand cmd, Unidade unidade)
    {
        if (cmd.GuidReferencia.Equals(Guid.Empty))
        {
            // TODO alterar o tipo para GUID
            unidade.GuidReferencia = $"{Guid.NewGuid()}";
            unidade.DataCriacao = DateTime.Now;
            unidade.DataUltimaModificacao = DateTime.Now;
            unidade.Status = true;
        }
        else
        {
            unidade.DataUltimaModificacao = DateTime.Now;
        }

        unidade.IdTipoUnidade = cmd.IdTipoUnidade;
        unidade.AreaUtil = cmd.AreaUtil;
        unidade.AreaTotal = cmd.AreaTotal;
        unidade.AreaHabitese = cmd.AreaHabitese;
        unidade.InscricaoIPTU = cmd.InscricaoIptu;
        unidade.Matricula = cmd.Matricula;
        unidade.MatriculaEnergia = cmd.MatriculaEnergia;
        unidade.MatriculaAgua = cmd.MatriculaAgua;
        unidade.TaxaAdministracao = cmd.TaxaAdministracao;
        unidade.ValorPotencial = cmd.ValorPotencial;
        unidade.UnidadeLocada = cmd.UnidadeLocada;
        unidade.Tipo = cmd.Tipo ?? string.Empty;
    }

    private async Task CriaVariasUnidades(int qtdUnidades, CriarUnidadeCommand cmd, Imovel imovel)
    {
        for (int i = 0; i < qtdUnidades; i++)
        {
            var unidade = new Unidade();
            BindUnidadeData(cmd, unidade);
            unidade.IdImovel = imovel.Id;
            unidadeRepository.Insert(unidade);
        }
    }
}