using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Service.Impl;

public class AnexoService: IAnexoService
{
    private readonly IAnexoRepository anexoRepository;
    
    public AnexoService(IAnexoRepository AnexoRepository)
    {
        this.anexoRepository = AnexoRepository;
    }

    public async Task<CommandResult> GetAll()
    {
        var Anexos = await Task.FromResult(anexoRepository.GetAll());

        return !Anexos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Anexos);
    }


    public async Task<CommandResult> GetById(int codigo)
    {
        var Anexo = await Task.FromResult(anexoRepository.GetById(codigo));

        return Anexo == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Anexo);
    }

    public async Task<CommandResult> GetByIdReferencia(string idReferencia)
    {
        var Anexos = await Task.FromResult(anexoRepository.BuscarAnexoPorIdReferencia(idReferencia));

        return !Anexos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Anexos);
    }

    public async Task<CommandResult> Insert(CriarAnexoCommand cmd)
    {
        var anexo = new Anexo
        {
            Nome                = cmd.Nome,
            DataCriacao         = DateTime.Now,
            GuidReferencia      = cmd.IdReferencia.ToString().ToUpper(),
            Local               = cmd.Local,
            Classificacao       = cmd.Classificacao,
            MineType            = cmd.MineType,
            Tamanho             = cmd.Tamanho
        };

        try
        {
            anexoRepository.Insert(anexo);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, anexo);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
            throw;
        }
    }

    public async Task<CommandResult> Update(int? codigo, CriarAnexoCommand cmd)
    {
        if (cmd == null || !codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var anexo = new Anexo
        {
            Id                  = codigo.Value,
            Nome                = cmd.Nome,
            GuidReferencia      = cmd.IdReferencia.ToString().ToUpper(),
            Local               = cmd.Local,
            Classificacao       = cmd.Classificacao,
            MineType            = cmd.MineType,
            Tamanho             = cmd.Tamanho
        };

        try
        {
            anexoRepository.Update(anexo);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, anexo);
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
            var _anexo = await Task.FromResult(anexoRepository.GetById(codigo.Value));

            if (_anexo == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                anexoRepository.Delete(codigo.Value);
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