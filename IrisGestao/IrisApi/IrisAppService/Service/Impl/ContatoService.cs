using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContatoService: IContatoService
{
    private readonly IContatoRepository contatoRepository;
    private readonly IClienteRepository clienteRepository;
    private readonly ILogger<IContatoService> logger;

    public ContatoService(IContatoRepository contatoRepository
                        , IClienteRepository clienteRepository
                        , ILogger<IContatoService> logger)
    {
        this.contatoRepository = contatoRepository;
        this.clienteRepository = clienteRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var cliente = await contatoRepository.GetByGuid(guid);

        return cliente == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, cliente);
    }


    public async Task<CommandResult> GetByGuidCliente(Guid guid)
    {
        if (guid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(guid);
        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        var contato = await contatoRepository.GetByClienteId(cliente.Id);

        return contato == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, contato);
    }

    public async Task<CommandResult> GetAll()
    {
        var contatos = await Task.FromResult(contatoRepository.GetAll());

        return !contatos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, contatos);
    }

    public async Task<CommandResult> Insert(CriarContatoCommand cmd)
    {
        var contato = new Contato();

        BindContatoData(cmd, contato);

        try
        {
            contatoRepository.Insert(contato);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, contato);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarContatoCommand cmd)
    {

        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var contato = await contatoRepository.GetByGuid(uuid);

        if (contato == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cmd.idCliente = contato.IdCliente.Value;
        BindContatoData(cmd, contato);
        
        try
        {
            contatoRepository.Update(contato);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, contato);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> Delete(Guid uuid)
    {
        if (uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        
        var contato = await contatoRepository.GetByGuid(uuid);

        if (contato == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
        }

        try
        {
            contatoRepository.Delete(contato.Id);
            return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
        }
    }

    private static void BindContatoData(CriarContatoCommand cmd, Contato contato)
    {
        switch (contato.GuidReferencia)
        {
            case null:
                contato.GuidReferencia = Guid.NewGuid();
                contato.DataCriacao = DateTime.Now;
                contato.DataUltimaModificacao = DateTime.Now;
                break;
            default:
                contato.GuidReferencia = contato.GuidReferencia;
                contato.DataUltimaModificacao = DateTime.Now;
                break;
        }

        contato.IdFornecedor    = contato.IdFornecedor;
        contato.IdCliente       = cmd.idCliente;
        contato.Nome            = cmd.Nome;
        contato.Telefone        = cmd.Telefone;
        contato.Email           = cmd.Email;
        contato.DataNascimento  = cmd.DataNascimento.HasValue ? cmd.DataNascimento : null;
        contato.Cargo           = cmd.Cargo;
        contato.DataCriacao     = contato.DataCriacao;
    }
}