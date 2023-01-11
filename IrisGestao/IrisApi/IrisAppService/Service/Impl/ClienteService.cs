using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ClienteService: IClienteService
{
    private readonly IClienteRepository clienteRepository;
    private readonly IImovelRepository imovelRepository;
    private readonly ILogger<IClienteService> logger;
    private readonly IContatoService contatoService;

    public ClienteService(IClienteRepository clienteRepository
                         ,IImovelRepository imovelRepository
                         , IContatoService contatoService
                         , ILogger<IClienteService> logger)
    {
        this.clienteRepository = clienteRepository;
        this.imovelRepository = imovelRepository;
        this.contatoService = contatoService;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(int? idTipo, string? nome, int limit, int page)
    {
        var Clientes = await clienteRepository.GetAllPaging(idTipo ,nome, limit, page);

        return Clientes == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Clientes);
    }

    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var cliente = await clienteRepository.GetByGuid(guid);

        return cliente == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, cliente);
    }

    public async Task<CommandResult> Insert(CriarClienteCommand cmd)
    {
        var cliente = new Cliente();
        BindClienteData(cmd, cliente);

        try
        {
            var customer = await clienteRepository.GetByCpfCnpj(cmd.CpfCnpj);

            if (customer != null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1007, customer);
            }

            clienteRepository.Insert(cliente);
            
            if(cmd.Contato != null)
            {
                cmd.Contato.GuidClienteReferencia = cliente.GuidReferencia.Value;
                await contatoService.Insert(cmd.Contato);
            }

            return new CommandResult(true, SuccessResponseEnums.Success_1000, cliente);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarClienteCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(uuid);

        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cmd.GuidReferencia = uuid;
        BindClienteData(cmd, cliente);

        try
        {
            clienteRepository.Update(cliente);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, cliente);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> AlterarStatus(Guid uuid, bool status)
    {
        if (uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var cliente = await clienteRepository.GetByReferenceGuid(uuid);

        if (cliente == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cliente.Status = status;

        try
        {
            clienteRepository.Update(cliente);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, cliente);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> Delete(int? codigo)
    {
        Cliente _cliente = new Cliente();
        if (!codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        else
        {
            var _Cliente = await Task.FromResult(clienteRepository.GetById(codigo.Value));

            if(_cliente == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                clienteRepository.Delete(codigo.Value);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception e)
            {
                logger.LogError(e.Message);
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }
        }
    }

    public async Task<CommandResult> GetAllOwners()
    {
        var proprietarios = await clienteRepository.GetAllOwners();

        return proprietarios == null || !proprietarios.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, proprietarios);
    }

    private static void BindClienteData(CriarClienteCommand cmd, Cliente cliente)
    {
        switch (cliente.GuidReferencia)
        {
            case null:
                cliente.GuidReferencia = Guid.NewGuid();
                cliente.DataCriacao = DateTime.Now;
                cliente.DataUltimaModificacao = DateTime.Now;
                cliente.Status = true;
                break;
            default:
                cliente.GuidReferencia = cliente.GuidReferencia;
                cliente.DataUltimaModificacao = DateTime.Now;
                break;
        }
        
        cliente.Nome = cmd.Nome;
        cliente.RazaoSocial = string.Empty.Equals(cmd.RazaoSocial)
            ? cmd.Nome
            : cmd.RazaoSocial;
        cliente.CpfCnpj = cmd.CpfCnpj;
        cliente.Telefone = cmd.Telefone;
        cliente.Email = cmd.Email;
        cliente.DataNascimento = cmd.DataNascimento;
        cliente.IdTipoCliente = cmd.IdTipoCliente;
        cliente.Endereco = cmd.Endereco;
        cliente.Bairro = cmd.Bairro;
        cliente.Cidade = cmd.Cidade;
        cliente.Estado = cmd.Estado;
        cliente.Cep = cmd.Cep.HasValue ? cmd.Cep.Value : 0; 
        cliente.Nps = cmd.Nps;
        cliente.Status = cmd.Status;
    }
}