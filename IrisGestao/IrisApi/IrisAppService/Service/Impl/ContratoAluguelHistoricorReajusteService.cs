using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContratoAluguelHistoricorReajusteService : IContratoAluguelHistoricorReajusteService
{
    private readonly IContratoAluguelHistoricoReajusteRepository contratoAluguelHistoricoReajusteRepository;
    private readonly IContratoAluguelRepository contratoAluguelRepository;
    private readonly ITituloReceberService tituloReceberService;
    private readonly ILogger<IContratoAluguelHistoricorReajusteService> logger;

    public ContratoAluguelHistoricorReajusteService(IContratoAluguelHistoricoReajusteRepository ContratoAluguelHistoricoReajusteRepository
                        , IContratoAluguelRepository ContratoAluguelRepository
                        , ITituloReceberService TituloReceberService
                        , ILogger<IContratoAluguelHistoricorReajusteService> logger)
    {
        this.contratoAluguelHistoricoReajusteRepository = ContratoAluguelHistoricoReajusteRepository;
        this.contratoAluguelRepository = ContratoAluguelRepository;
        this.tituloReceberService = TituloReceberService;
        this.logger = logger;
    }

    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var cliente = await contratoAluguelHistoricoReajusteRepository.GetByGuid(guid);

        return cliente == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, cliente);
    }


    public async Task<CommandResult> GetByGuidContratoAluguel(Guid guid)
    {
        if (guid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var contratoAluguelHistoricoReajuste = await contratoAluguelHistoricoReajusteRepository.GetByGuidContratoAluguel(guid);
        if (contratoAluguelHistoricoReajuste == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        return contratoAluguelHistoricoReajuste == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, contratoAluguelHistoricoReajuste);
    }

    public async Task<CommandResult> Insert(ContratoAluguelHistoricoReajusteCommand cmd)
    {
        var contratoAluguelHistoricoReajuste = new ContratoAluguelHistoricoReajuste();
        if (contratoAluguelHistoricoReajuste == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        BindContratoAluguelHistoricoData(cmd, contratoAluguelHistoricoReajuste);

        try
        {
            contratoAluguelHistoricoReajusteRepository.Insert(contratoAluguelHistoricoReajuste);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, contratoAluguelHistoricoReajuste);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    private static void BindContratoAluguelHistoricoData(ContratoAluguelHistoricoReajusteCommand cmd, ContratoAluguelHistoricoReajuste contratoAluguelHistoricoReajuste)
    {
        contratoAluguelHistoricoReajuste.GuidReferencia            = Guid.NewGuid();
        contratoAluguelHistoricoReajuste.DataCriacao               = DateTime.Now;
        contratoAluguelHistoricoReajuste.IdContratoAluguel         = cmd.IdContratoAluguel;
        contratoAluguelHistoricoReajuste.PercentualReajusteNovo    = cmd.PercentualReajusteNovo;
        contratoAluguelHistoricoReajuste.PercentualReajusteAnterior  = cmd.PercentualReajusteAntigo;
        contratoAluguelHistoricoReajuste.ValorAluguelNovo          = cmd.ValorAluguelNovo;
        contratoAluguelHistoricoReajuste.ValorAluguelAnterior      = cmd.ValorAluguelAnterior;
        contratoAluguelHistoricoReajuste.AlteradoPor               = cmd.AlteradoPor;
    }
}