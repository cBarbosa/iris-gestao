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

}