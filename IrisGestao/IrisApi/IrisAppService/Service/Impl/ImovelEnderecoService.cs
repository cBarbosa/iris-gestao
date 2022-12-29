using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using IrisGestao.Infraestructure.ExternalServices;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ImovelEnderecoService: IImovelEnderecoService
{
    private readonly IImovelEnderecoRepository imovelEnderecoRepository;
    private readonly IRepublicaVirtualService republicaVirtualService;
    private readonly ILogger<ImovelEnderecoService> logger;
    
    public ImovelEnderecoService(
        IImovelEnderecoRepository imovelEnderecoRepository,
        IRepublicaVirtualService republicaVirtualService,
        ILogger<ImovelEnderecoService> logger)
    {
        this.imovelEnderecoRepository = imovelEnderecoRepository;
        this.republicaVirtualService = republicaVirtualService;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAll()
    {
        var Imoveis = await Task.FromResult(imovelEnderecoRepository.GetAll());

        return !Imoveis.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Imoveis);
    }

    public async Task<CommandResult> GetById(int codigo)
    {
        var ImovelEndereco = await Task.FromResult(imovelEnderecoRepository.GetById(codigo));

        return ImovelEndereco == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, ImovelEndereco);
    }
    public async Task<CommandResult> BuscarEnderecoPorImovel(int codigo)
    {
        var ImovelEndereco = await Task.FromResult(imovelEnderecoRepository.BuscarEnderecoPorImovel(codigo));

        return ImovelEndereco == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, ImovelEndereco);
    }

    public async Task<CommandResult> Insert(CriarImovelEnderecoCommand cmd)
    {
        var ImovelEndereco = new ImovelEndereco
        {
            IdImovel                    = cmd.idImovel,
            Rua                         = cmd.Rua,
            Complemento                 = cmd.Complemento,
            Bairro                      = cmd.Bairro,
            Cidade                      = cmd.Cidade,
            UF                          = cmd.UF,
            Cep                         = cmd.Cep,
            DataUltimaModificacao       = DateTime.Now
        };

        try
        {
            imovelEnderecoRepository.Insert(ImovelEndereco);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, ImovelEndereco);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
            throw;
        }
    }

    public async Task<CommandResult> Update(int? codigo, CriarImovelEnderecoCommand cmd)
    {
        ImovelEndereco _ImovelEndereco = new ImovelEndereco();
        if (cmd == null || !codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var ImovelEndereco = new ImovelEndereco
        {
            Id                          = codigo.Value,
            IdImovel                    = cmd.idImovel,
            Rua                         = cmd.Rua,
            Complemento                 = cmd.Complemento,
            Bairro                      = cmd.Bairro,
            Cidade                      = cmd.Cidade,
            UF                          = cmd.UF,
            Cep                         = cmd.Cep,
            DataUltimaModificacao       = DateTime.Now
        };

        try
        {
            imovelEnderecoRepository.Update(ImovelEndereco);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, ImovelEndereco);
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
            var _imovelEndereco = await Task.FromResult(imovelEnderecoRepository.GetById(codigo.Value));

            if(_imovelEndereco == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                imovelEnderecoRepository.Delete(codigo.Value);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
                throw;
            }
        }
    }
    
    public async Task<CommandResult> BuscarEnderecoPorCEP(string cep)
    {
        try
        {
            var result = await republicaVirtualService.GetCepData(cep);

            return result == null
                ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
                : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1005, e.Message);
        }
    }
}