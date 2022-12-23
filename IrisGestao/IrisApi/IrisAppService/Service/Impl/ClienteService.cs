﻿using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ClienteService: IClienteService
{
    private readonly IClienteRepository clienteRepository;
    private readonly IImovelRepository imovelRepository;

    public ClienteService(IClienteRepository clienteRepository
                         ,IImovelRepository imovelRepository)
    {
        this.clienteRepository = clienteRepository;
        this.imovelRepository = imovelRepository;
    }

    public async Task<CommandResult> GetAllPaging(int limit, int page)
    {
        var Clientes = await clienteRepository.GetAllPaging(limit, page);

        return Clientes == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Clientes);
    }

    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var cliente = await clienteRepository.GetByGuid(guid);
        //var imoveis = await imovelRepository.GetAllByCliente(guid);
        //cliente.Imovel = imoveis;

        return cliente == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, cliente);
    }

    public async Task<CommandResult> Insert(CriarClienteCommand cmd)
    {
        var Cliente = new Cliente
        {
            Nome                    = cmd.Nome,
            CpfCnpj                 = cmd.CpfCnpj,
            IdTipoCliente           = cmd.IdTipoCliente,
            RazaoSocial             = cmd.RazaoSocial,
            Endereco                = cmd.Endereco,
            Bairro                  = cmd.Bairro,
            Cidade                  = cmd.Cidade,
            Estado                  = cmd.Estado,
            Cep                     = cmd.Cep.Value,
            DataNascimento          = cmd.DataNascimento,
            Nps                     = cmd.Nps,
            Telefone                = cmd.Telefone,
            Email                   = cmd.Email,
            GuidReferencia          = Guid.Parse(Guid.NewGuid().ToString().ToUpper()),
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            clienteRepository.Insert(Cliente);
            return new CommandResult(true, SuccessResponseEnums.Success_1000, Cliente);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
            throw;
        }
    }

    public async Task<CommandResult> Update(int? codigo, CriarClienteCommand cmd)
    {
        Cliente _cliente = new Cliente();
        if (cmd == null || !codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var Cliente = new Cliente
        {
            Id                      = codigo.Value,
            Nome                    = cmd.Nome,
            CpfCnpj                 = cmd.CpfCnpj,
            IdTipoCliente           = cmd.IdTipoCliente,
            RazaoSocial             = cmd.RazaoSocial,
            Endereco                = cmd.Endereco,
            Bairro                  = cmd.Bairro,
            Cidade                  = cmd.Cidade,
            Estado                  = cmd.Estado,
            Cep                     = cmd.Cep.Value,
            DataNascimento          = cmd.DataNascimento.HasValue ? cmd.DataNascimento : null,
            Nps                     = cmd.Nps,
            Telefone                = cmd.Telefone,
            Email                   = cmd.Email,
            GuidReferencia          = Guid.Parse(cmd.GuidReferencia.ToUpper()),
            DataUltimaModificacao   = DateTime.Now
        };

        try
        {
            clienteRepository.Update(Cliente);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, Cliente);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
            throw;
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
            catch (Exception)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
                throw;
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
}