using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class DadoBancarioService : IDadoBancarioService
{
    private readonly IDadoBancarioRepository DadoBancarioRepository;
    private readonly ILogger<IDadoBancarioService> logger;

    public DadoBancarioService(IDadoBancarioRepository dadoBancarioRepository
                        , ILogger<IDadoBancarioService> logger)
    {
        this.DadoBancarioRepository = dadoBancarioRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetById(int id)
    {
        var dadoBancario = DadoBancarioRepository.GetById(id);

        return dadoBancario == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, dadoBancario);
    }

    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var cliente = await DadoBancarioRepository.GetByGuid(guid);

        return cliente == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, cliente);
    }

    public async Task<CommandResult> Insert(CriarDadosBancarioCommand cmd)
    {
        if (cmd == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        DadoBancario dadoBancario = new DadoBancario();
        BindDadosBancariosData(cmd, ref dadoBancario);

        try
        {
            DadoBancarioRepository.Insert(dadoBancario);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, dadoBancario);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
        }
        return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
    }

    public async Task<CommandResult> Update(CriarDadosBancarioCommand cmd)
    {
        if (cmd == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        var dadoBancario = await DadoBancarioRepository.GetByGuid(cmd.GuidReferencia.Value);

        if (dadoBancario == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        BindDadosBancariosData(cmd, ref dadoBancario);

        try
        {
            DadoBancarioRepository.Update(dadoBancario);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, dadoBancario);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    private static void BindDadosBancariosData(CriarDadosBancarioCommand cmd, ref DadoBancario dadoBancario)
    {
        if (!cmd.IdBanco.HasValue)
        {
            dadoBancario = null!;
            return;
        }
        
        switch (dadoBancario.GuidReferencia)
        {
            case null:
                dadoBancario.GuidReferencia = Guid.NewGuid();
                break;
            default:
                dadoBancario.GuidReferencia = dadoBancario.GuidReferencia;
                break;
        }

        if (dadoBancario.Id <= 0 && cmd.Id <= 0)
        {
            dadoBancario.DataCriacao = DateTime.Now;
        }

        dadoBancario.Agencia = cmd.Agencia;
        dadoBancario.Operacao = cmd.Operacao;
        dadoBancario.Conta = cmd.Conta;
        dadoBancario.IdBanco = cmd.IdBanco;
        dadoBancario.ChavePix = cmd.ChavePix;
    }
}