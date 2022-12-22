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

    public async Task<CommandResult> GetAllPaging(int? idCategoria, string? nome, int limit, int page)
    {
        var result = await imovelRepository.GetAllPaging(idCategoria, nome, limit, page);

        return result == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
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
        var imovel = new Imovel();
        cmd.GuidReferencia = null;
        BindImoveisData(cmd, imovel);
        
        try
        {
            imovelRepository.Insert(imovel);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, imovel);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
            throw;
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarImovelCommand cmd)
    {
        if (cmd == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var imovel = await imovelRepository.GetByReferenceGuid(uuid);

        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cmd.GuidReferencia = uuid;
        BindImoveisData(cmd, imovel);

        try
        {
            imovelRepository.Update(imovel);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, imovel);
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
    
    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var imovel = await imovelRepository.GetByGuid(guid);

        return imovel == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, imovel);
    }
    
    private static void BindImoveisData(CriarImovelCommand cmd, Imovel imovel)
    {
        switch (imovel.GuidReferencia)
        {
            case null:
                imovel.GuidReferencia = Guid.NewGuid();
                imovel.DataCriacao = DateTime.Now;
                break;
            default:
                imovel.DataUltimaModificacao = DateTime.Now;
                break;
        }

        imovel.Nome = cmd.Nome;
        imovel.IdCategoriaImovel = cmd.IdCategoriaImovel;
        imovel.IdClienteProprietario = cmd.IdClienteProprietario;
        imovel.NumCentroCusto = cmd.NumCentroCusto;
        imovel.MonoUsuario = cmd.MonoUsuario;
        imovel.Classificacao = cmd.Classificacao;
    }
}