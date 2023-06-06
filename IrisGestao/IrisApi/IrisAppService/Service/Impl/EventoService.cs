using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;
using System;

namespace IrisGestao.ApplicationService.Service.Impl;

public class EventoService: IEventoService
{
    private readonly IEventoRepository eventoRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly IClienteRepository clienteRepository;

    public EventoService(IEventoRepository EventoRepository, 
        IImovelRepository ImovelRepository,
        IClienteRepository ClienteRepository)
    {
        this.eventoRepository = EventoRepository;
        this.imovelRepository = ImovelRepository;
        this.clienteRepository = ClienteRepository;
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
        Evento Evento = new Evento();
        if (cmd == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var imovel = await imovelRepository.GetByReferenceGuid(cmd.IdImovel);
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.IdCliente);
        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }

        Evento.IdImovel  = imovel.Id;
        Evento.IdCliente = cliente.Id;
        BindEventoData(cmd, Evento);

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

    public async Task<CommandResult> Update(Guid uuid, CriarEventoCommand cmd)
    {
        Evento evento = new Evento();
        if (cmd == null || uuid == Guid.Empty)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var imovel = await imovelRepository.GetByReferenceGuid(cmd.IdImovel);
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.IdCliente);
        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Cliente", null!);
        }
        evento = await eventoRepository.GetByReferenceGuid(uuid);
        if (evento == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Evento", null!);
        }

        evento.IdImovel = imovel.Id;
        evento.IdCliente = cliente.Id;
        BindEventoData(cmd, evento);

        try
        {
            eventoRepository.Update(evento);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, evento);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
            throw;
        }
    }

    public async Task<CommandResult> Delete(Guid uuid)
    {
        Evento _evento = new Evento();
        if (uuid == Guid.Empty)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        else
        {
            _evento = await eventoRepository.GetByReferenceGuid(uuid);
            if (_evento == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Evento", null!);
            }

            try
            {
                eventoRepository.Delete(_evento.Id);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
                throw;
            }
        }
    }

    private static void BindEventoData(CriarEventoCommand cmd, Evento Evento)
    {
        switch (Evento.GuidReferencia)
        {
            case null:
                Evento.GuidReferencia           = Guid.NewGuid();
                Evento.DataCriacao              = DateTime.Now;
                Evento.DataUltimaModificacao    = DateTime.Now;
                break;
            default:
                Evento.GuidReferencia           = Evento.GuidReferencia;
                Evento.DataUltimaModificacao    = DateTime.Now;
                break;
        }

        Evento.Nome                         = cmd.Nome;
        Evento.IdTipoEvento                 = cmd.IdTipoEvento;
        Evento.DthRealizacao                = cmd.DthRealizacao;
        Evento.descricao                    = cmd.Descricao;
    }
}