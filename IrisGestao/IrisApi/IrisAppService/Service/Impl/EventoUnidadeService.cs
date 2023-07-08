using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class EventoUnidadeService: IEventoUnidadeService
{
    private readonly IEventoUnidadeRepository EventoUnidadeRepository;
    
    private readonly ILogger<IEventoUnidadeService> logger;

    public EventoUnidadeService(IEventoUnidadeRepository EventoUnidadeRepository
                        , ILogger<IEventoUnidadeService> logger)
    {
        this.EventoUnidadeRepository = EventoUnidadeRepository;
        this.logger = logger;
    }

}