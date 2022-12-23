using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Service.Impl;

public class UnidadeService: IUnidadeService
{
    private readonly IUnidadeRepository unidadeRepository;
    
    public UnidadeService(IUnidadeRepository UnidadeRepository)
    {
        this.unidadeRepository = UnidadeRepository;
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

    public async Task<CommandResult> Insert(CriarUnidadeCommand cmd)
    {
        var Unidade = new Unidade
        {
            // IdImovel                = cmd.IdImovel.Value,
            IdTipoUnidade           = cmd.IdTipoUnidade,
            AreaUtil                = cmd.AreaUtil,
            AreaTotal               = cmd.AreaTotal,
            AreaHabitese            = cmd.AreaHabitese.HasValue ? cmd.AreaHabitese.Value : null,
            InscricaoIPTU           = cmd.InscricaoIptu,
            MatriculaEnergia        = cmd.MatriculaEnergia,
            MatriculaAgua           = cmd.MatriculaAgua,
            TaxaAdministracao       = cmd.TaxaAdministracao,
            ValorPotencial          = cmd.ValorPotencial,
            UnidadeLocada           = cmd.UnidadeLocada,
            GuidReferencia          = Guid.NewGuid().ToString().ToUpper(),    
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            unidadeRepository.Insert(Unidade);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, Unidade);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
            throw;
        }
    }

    public async Task<CommandResult> Update(Guid guid, CriarUnidadeCommand cmd)
    {
        if (cmd == null || guid.Equals(Guid.Empty) || cmd.GuidReferencia == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var Unidade = new Unidade
        {
            // Id                      = codigo.Value,
            // IdImovel                = cmd.IdImovel,
            GuidReferencia          = cmd.GuidReferencia.ToString(),
            IdTipoUnidade           = cmd.IdTipoUnidade,
            AreaUtil                = cmd.AreaUtil,
            AreaTotal               = cmd.AreaTotal,
            AreaHabitese            = cmd.AreaHabitese.HasValue ? cmd.AreaHabitese.Value : null,
            InscricaoIPTU           = cmd.InscricaoIptu,
            MatriculaEnergia        = cmd.MatriculaEnergia,
            MatriculaAgua           = cmd.MatriculaAgua,
            TaxaAdministracao       = cmd.TaxaAdministracao,
            ValorPotencial          = cmd.ValorPotencial,
            UnidadeLocada           = cmd.UnidadeLocada,
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            unidadeRepository.Update(Unidade);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, Unidade);
        }
        catch (Exception)
        {
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
}