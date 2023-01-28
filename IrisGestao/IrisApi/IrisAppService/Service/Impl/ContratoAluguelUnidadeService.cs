using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContratoAluguelUnidadeService: IContratoAluguelUnidadeService
{
    private readonly IContratoAluguelImovelRepository ContratoAluguelImovelRepository;
    
    private readonly ILogger<IContratoAluguelUnidadeService> logger;

    public ContratoAluguelUnidadeService(IContratoAluguelImovelRepository ContratoAluguelImovelRepository
                        , ILogger<IContratoAluguelUnidadeService> logger)
    {
        this.ContratoAluguelImovelRepository = ContratoAluguelImovelRepository;
        this.logger = logger;
    }

}