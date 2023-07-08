using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContratoAluguelImovelService: IContratoAluguelImovelService
{
    private readonly IContratoAluguelImovelRepository ContratoAluguelImovelRepository;
    
    private readonly ILogger<IContratoAluguelImovelService> logger;

    public ContratoAluguelImovelService(IContratoAluguelImovelRepository ContratoAluguelImovelRepository
                        , ILogger<IContratoAluguelImovelService> logger)
    {
        this.ContratoAluguelImovelRepository = ContratoAluguelImovelRepository;
        this.logger = logger;
    }

    /*public async Task<CommandResult> PutContratoAluguel(ContratoAluguel contratoAluguel)
    {
        List<ContratoAluguelImovel> lstContratoAluguelImovel = new List<ContratoAluguelImovel>();
        if (lstContratoAluguelImovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        try
        {
            foreach (var fatura in lstFaturasTitulo)
            {
                fatura.Status = false;
                fatura.StatusFatura = FaturaTituloEnum.INATIVO;
                fatura.DescricaoBaixaFatura = "Fatura cancelada devido cancelamento do contrato de aluguel";
                faturaTituloRepository.Update(fatura);
            }
            tituloReceberRepository.Update(tituloReceber);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, tituloReceber);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }*/
}