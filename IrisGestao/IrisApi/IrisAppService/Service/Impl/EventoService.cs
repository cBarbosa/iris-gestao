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
    private readonly IEventoUnidadeRepository eventoUnidadeRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly IUnidadeRepository unidadeRepository;
    private readonly IClienteRepository clienteRepository;

    public EventoService(IEventoRepository EventoRepository,
        IEventoUnidadeRepository EventoUnidadeRepository,
        IImovelRepository ImovelRepository,
        IUnidadeRepository UnidadeRepository,
        IClienteRepository ClienteRepository)
    {
        this.eventoRepository = EventoRepository;
        this.eventoUnidadeRepository = EventoUnidadeRepository;
        this.imovelRepository = ImovelRepository;
        this.unidadeRepository = UnidadeRepository;
        this.clienteRepository = ClienteRepository;
    }

    public async Task<CommandResult> GetAll()
    {
        var Eventos = await Task.FromResult(eventoRepository.GetAll());

        return !Eventos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Eventos);
    }

    public async Task<CommandResult> GetAllPaging(int limit, int page)
    {
        var result = await eventoRepository.GetAllPaging(limit, page);

        return result == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
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
        List<EventoUnidade> lstEventoUnidade = new List<EventoUnidade>();
        
        if (cmd == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var imovel = await imovelRepository.GetByReferenceGuid(cmd.GuidImovel);
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.GuidCliente);
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
            foreach (var guidUnidade in cmd.lstUnidades)
            {
                EventoUnidade eventoUnidade = new EventoUnidade();
                var unidade = await unidadeRepository.GetByReferenceGuid(guidUnidade);
                eventoUnidade.IdEvento = Evento.Id;
                eventoUnidade.IdUnidade = unidade.Id;

                eventoUnidadeRepository.Insert(eventoUnidade);
            }           
            
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

        var imovel = await imovelRepository.GetByReferenceGuid(cmd.GuidImovel);
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(cmd.GuidCliente);
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