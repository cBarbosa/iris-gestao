using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TituloImovelService: ITituloImovelService
{
    private readonly ITituloImovelRepository TituloImovelRepository;
    
    private readonly ILogger<ITituloImovelService> logger;

    public TituloImovelService(ITituloImovelRepository TituloImovelRepository
                        , ILogger<ITituloImovelService> logger)
    {
        this.TituloImovelRepository = TituloImovelRepository;
        this.logger = logger;
    }

}