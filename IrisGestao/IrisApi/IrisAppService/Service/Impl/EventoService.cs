using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Service.Impl;

public class EventoService: IEventoService
{
    private readonly IEventoRepository eventoRepository;
    
    public EventoService(IEventoRepository EventoRepository)
    {
        this.eventoRepository = EventoRepository;
    }

    public async Task<CommandResult> GetAll()
    {
        var Eventos = await Task.FromResult(eventoRepository.GetAll());

        return !Eventos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Eventos);
    }

    public async Task<CommandResult> GetById(int codigo)
    {
        var Evento = await Task.FromResult(eventoRepository.GetById(codigo));

        return Evento == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Evento);
    }

    public async Task<CommandResult> BuscarEventoPorIdImovel(int codigo)
    {
        var Eventos = await Task.FromResult(eventoRepository.BuscarEventoPorIdImovel(codigo));

        return !Eventos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Eventos);
    }

    public async Task<CommandResult> BuscarEventoPorIdCliente(int codigo)
    {
        var Eventos = await Task.FromResult(eventoRepository.BuscarEventoPorIdCliente(codigo));

        return !Eventos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Eventos);
    }

    public async Task<CommandResult> Insert(CriarEventoCommand cmd)
    {
        var Evento = new Evento
        {
            IdImovel                = cmd.IdImovel,
            IdTipoEvento            = cmd.IdTipoEvento,
            IdCliente               = cmd.IdCliente,
            Nome                    = cmd.Nome,
            DthRealizacao = cmd.DthRealizacao.HasValue ? cmd.DthRealizacao.Value : null,
            GuidReferencia          = Guid.NewGuid().ToString().ToUpper(),
            DataCriacao             = DateTime.Now,
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            eventoRepository.Insert(Evento);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, Evento);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
            throw;
        }
    }

    public async Task<CommandResult> Update(int? codigo, CriarEventoCommand cmd)
    {
        if (cmd == null || !codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var Evento = new Evento
        {
            Id                      = codigo.Value,
            IdImovel                = cmd.IdImovel,
            IdTipoEvento            = cmd.IdTipoEvento,
            IdCliente               = cmd.IdCliente,
            Nome                    = cmd.Nome,
            DthRealizacao           = cmd.DthRealizacao.HasValue ? cmd.DthRealizacao.Value : null,
            GuidReferencia          = Guid.NewGuid().ToString().ToUpper(),
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            eventoRepository.Update(Evento);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, Evento);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
            throw;
        }
    }

    public async Task<CommandResult> Delete(int? codigo)
    {
        Evento _evento = new Evento();
        if (!codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        else
        {
            var _Evento = await Task.FromResult(eventoRepository.GetById(codigo.Value));

            if(_evento == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                eventoRepository.Delete(codigo.Value);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
                throw;
            }
        }
    }
}