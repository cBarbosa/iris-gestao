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

    public async Task<CommandResult> GetByGuid(Guid uuid)
    {
        var Evento = await Task.FromResult(eventoRepository.GetByGuid(uuid));

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
        // List<EventoUnidade> lstEventoUnidade = new List<EventoUnidade>();
        
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
        var evento = new Evento
        {
            GuidReferencia = Guid.Empty,
            IdImovel = imovel.Id,
            IdCliente = cliente.Id
        };
        BindEventoData(cmd, ref evento);

        try
        {
            eventoRepository.Insert(evento);
            foreach (var guidUnidade in cmd.lstUnidades)
            {
                var eventoUnidade = new EventoUnidade();
                var unidade = await unidadeRepository.GetByReferenceGuid(guidUnidade);
                eventoUnidade.IdEvento = evento.Id;
                eventoUnidade.IdUnidade = unidade.Id;

                eventoUnidadeRepository.Insert(eventoUnidade);
            }

            return new CommandResult(true, SuccessResponseEnums.Success_1000, evento);
        }
        catch (Exception ex)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, ex);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarEventoCommand cmd)
    {
        if (cmd is null || uuid.Equals(Guid.Empty))
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

        var evento = await eventoRepository.GetByReferenceGuid(uuid);
        if (evento == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006 + " do Evento", null!);
        }

        evento.IdImovel = imovel.Id;
        evento.IdCliente = cliente.Id;
        BindEventoData(cmd, ref evento);

        try
        {
            eventoRepository.Update(evento);
            
            var listaEventosGuid = evento.EventoUnidade
                .Select(x => Guid.Parse(x.IdUnidadeNavigation.GuidReferencia));

            foreach (var eventUnit in listaEventosGuid)
            {
                if (!cmd.lstUnidades.Contains(eventUnit))
                {
                    var unidade = await unidadeRepository.GetByReferenceGuid(eventUnit);
                    
                    var eventoUnidade = evento.EventoUnidade
                        .SingleOrDefault(x => x.IdEvento.Equals(evento.Id)
                                              && x.IdUnidade.Equals(unidade.Id));
                    
                    eventoUnidadeRepository.Delete(eventoUnidade.Id);
                }
                else
                {
                    cmd.lstUnidades.Remove(eventUnit);
                }
            }

            foreach (var eventUnit in cmd.lstUnidades)
            {
                var unidade = await unidadeRepository.GetByReferenceGuid(eventUnit);
                var eventoUnidade = new EventoUnidade();
                eventoUnidade.IdEvento = evento.Id;
                eventoUnidade.IdUnidade = unidade.Id;
                
                eventoUnidadeRepository.Insert(eventoUnidade);
            }
            
            return new CommandResult(true, SuccessResponseEnums.Success_1001, evento);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
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
    
    public async Task<CommandResult> GetAllProperties()
    {
        var result = await eventoRepository.GetAllProperties();

        return !result.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
    }

    public async Task<CommandResult> GetAllRenters()
    {
        var result = await eventoRepository.GetAllRenters();

        return !result.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
    }

    private static void BindEventoData(CriarEventoCommand cmd, ref Evento evento)
    {
        if (evento.GuidReferencia.Equals(Guid.Empty))
        {
            evento.GuidReferencia           = Guid.NewGuid();
            evento.DataCriacao              = DateTime.Now;
            evento.DataUltimaModificacao    = DateTime.Now;
        }
        else
        {
            evento.DataUltimaModificacao    = DateTime.Now;
        }

        evento.Nome                         = cmd.Nome;
        evento.IdTipoEvento                 = cmd.IdTipoEvento.HasValue
                                                ? cmd.IdTipoEvento.Value
                                                : null;
        evento.TipoEvento                   = cmd.TipoEvento;
        evento.Descricao                    = cmd.Descricao;
        evento.DthRealizacao                = cmd.DthRealizacao;
    }
}