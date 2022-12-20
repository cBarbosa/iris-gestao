using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ImovelService: IImovelService
{
    private readonly IImovelRepository imovelRepository;
    
    public ImovelService(IImovelRepository ImovelRepository)
    {
        this.imovelRepository = ImovelRepository;
    }

    public async Task<CommandResult> GetAll(int? idCategoriaImovel, string nome)
    {
        var Imoveis = await Task.FromResult(imovelRepository.GetAll(idCategoriaImovel, nome).ToList());

        return !Imoveis.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Imoveis);
    }

    public async Task<CommandResult> GetById(int codigo)
    {
        var Imovel = await Task.FromResult(imovelRepository.GetById(codigo));

        return Imovel == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Imovel);
    }

    public async Task<CommandResult> Insert(CriarImovelCommand cmd)
    {
        var Imovel = new Imovel
        {
            Nome                    = cmd.Nome,
            IdCategoriaImovel       = cmd.IdCategoriaImovel,
            IdClienteProprietario   = cmd.IdClienteProprietario,
            NumCentroCusto          = cmd.NumCentroCusto,
            MonoUsuario             = cmd.MonoUsuario,
            Classificacao           = cmd.Classificacao,
            GuidReferencia          = Guid.NewGuid().ToString().ToUpper(),    
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            imovelRepository.Insert(Imovel);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, Imovel);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
            throw;
        }
    }

    public async Task<CommandResult> Update(int? codigo, CriarImovelCommand cmd)
    {
        Imovel _Imovel = new Imovel();
        if (cmd == null || !codigo.HasValue || cmd.GuidReferencia == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var Imovel = new Imovel
        {
            Id                      = codigo.Value,
            Nome                    = cmd.Nome,
            IdCategoriaImovel       = cmd.IdCategoriaImovel,
            IdClienteProprietario   = cmd.IdClienteProprietario,
            NumCentroCusto          = cmd.NumCentroCusto,
            MonoUsuario             = cmd.MonoUsuario,
            Classificacao           = cmd.Classificacao,
            GuidReferencia          = cmd.GuidReferencia.ToUpper(),
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            imovelRepository.Update(Imovel);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, Imovel);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
            throw;
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
            var _imovel = await Task.FromResult(imovelRepository.GetById(codigo.Value));

            if(_imovel == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                imovelRepository.Delete(codigo.Value);
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