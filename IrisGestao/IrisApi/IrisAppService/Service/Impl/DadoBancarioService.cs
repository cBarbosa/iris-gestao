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
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    private static void BindDadosBancariosData(CriarDadosBancarioCommand cmd, ref DadoBancario dadoBancario)
    {
        if (string.IsNullOrEmpty(cmd.Banco))
        {
            dadoBancario = null!;
            return;
        }

        if (dadoBancario.Id <= 0)
        {
            dadoBancario.DataCriacao = DateTime.Now;
        }

        dadoBancario.Agencia = cmd.Agencia;
        dadoBancario.Operacao = cmd.Operacao;
        dadoBancario.Conta = cmd.Conta;
        dadoBancario.Banco = cmd.Banco ?? string.Empty;
        dadoBancario.ChavePix = cmd.ChavePix ?? string.Empty;
    }
}