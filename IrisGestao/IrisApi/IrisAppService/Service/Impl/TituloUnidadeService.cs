using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class TituloUnidadeService: ITituloUnidadeService
{
    private readonly ITituloUnidadeRepository TituloUnidadeRepository;
    
    private readonly ILogger<ITituloUnidadeService> logger;

    public TituloUnidadeService(ITituloUnidadeRepository TituloUnidadeRepository
                        , ILogger<ITituloUnidadeService> logger)
    {
        this.TituloUnidadeRepository = TituloUnidadeRepository;
        this.logger = logger;
    }

}