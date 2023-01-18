using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContratoAluguelService: IContratoAluguelService
{
    private readonly IContratoAluguelRepository ContratoAluguelRepository;
    private readonly IContratoAluguelRepository contratoAluguelRepository;
    private readonly ILogger<IContratoAluguelService> logger;

    public ContratoAluguelService(IContratoAluguelRepository ContratoAluguelRepository
                        , IContratoAluguelRepository contratoAluguelRepository
                        , ILogger<IContratoAluguelService> logger)
    {
        this.ContratoAluguelRepository = ContratoAluguelRepository;
        this.contratoAluguelRepository = contratoAluguelRepository;
        this.logger = logger;
    }
    /*
    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var contratoAluguel = await ContratoAluguelRepository.GetByGuid(guid);

        return contratoAluguel == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, contratoAluguel);
    }*/


    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        if (guid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var ContratoAluguel = await ContratoAluguelRepository.GetByContratoAluguelGuid(guid);

        return ContratoAluguel == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, ContratoAluguel);
    }

    public async Task<CommandResult> GetAll()
    {
        var ContratoAluguels = await Task.FromResult(ContratoAluguelRepository.GetAll());

        return !ContratoAluguels.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, ContratoAluguels);
    }

    public async Task<CommandResult> Insert(CriarContratoAluguelCommand cmd)
    {
        var ContratoAluguel = new ContratoAluguel();

        BindContratoAluguelData(cmd, ContratoAluguel);

        try
        {
            ContratoAluguelRepository.Insert(ContratoAluguel);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, ContratoAluguel);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarContratoAluguelCommand cmd)
    {

        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var ContratoAluguel = await ContratoAluguelRepository.GetByGuid(uuid);

        if (ContratoAluguel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        BindContratoAluguelData(cmd, ContratoAluguel);

        try
        {
            ContratoAluguelRepository.Update(ContratoAluguel);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, ContratoAluguel);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> Delete(Guid uuid)
    {
        if (uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        else
        {
            var ContratoAluguel = await ContratoAluguelRepository.GetByGuid(uuid);

            if (ContratoAluguel == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                ContratoAluguelRepository.Delete(ContratoAluguel.Id);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception e)
            {
                logger.LogError(e.Message);
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }
        }
    }

    private static void BindContratoAluguelData(CriarContratoAluguelCommand cmd, ContratoAluguel ContratoAluguel)
    {
        switch (ContratoAluguel.GuidReferencia)
        {
            case null:
                ContratoAluguel.GuidReferencia = Guid.NewGuid();
                ContratoAluguel.DataCriacao = DateTime.Now;
                ContratoAluguel.DataUltimaModificacao = DateTime.Now;
                break;
            default:
                ContratoAluguel.GuidReferencia = ContratoAluguel.GuidReferencia;
                ContratoAluguel.DataUltimaModificacao = DateTime.Now;
                break;
        }
        /*
        ContratoAluguel.NumeroContrato    = ContratoAluguel.IdFornecedor;
        ContratoAluguel.IdcontratoAluguel       = ContratoAluguel.IdcontratoAluguel;
        ContratoAluguel.Nome            = cmd.Nome;
        ContratoAluguel.Telefone        = cmd.Telefone;
        ContratoAluguel.Email           = cmd.Email;
        ContratoAluguel.DataNascimento  = cmd.DataNascimento.HasValue ? cmd.DataNascimento : null;
        ContratoAluguel.Cargo           = cmd.Cargo;
        ContratoAluguel.DataCriacao     = ContratoAluguel.DataCriacao;
        */
    }
}