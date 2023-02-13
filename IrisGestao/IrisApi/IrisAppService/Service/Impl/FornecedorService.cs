using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class FornecedorService: IFornecedorService
{
    private readonly IFornecedorRepository FornecedorRepository;
    private readonly ILogger<IFornecedorService> logger;
    private readonly IContatoService contatoService;
    private readonly IDadoBancarioService DadoBancarioService;

    public FornecedorService(IFornecedorRepository FornecedorRepository
                         , IContatoService contatoService
                         , IDadoBancarioService dadoBancarioService
                         , ILogger<IFornecedorService> logger)
    {
        this.FornecedorRepository = FornecedorRepository;
        this.DadoBancarioService = dadoBancarioService;
        this.contatoService = contatoService;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(string? nome, int limit, int page)
    {
        var Fornecedors = await FornecedorRepository.GetAllPaging(nome, limit, page);

        return Fornecedors == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Fornecedors);
    }

    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var Fornecedor = await FornecedorRepository.GetByGuid(guid);

        return Fornecedor == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Fornecedor);
    }

    public async Task<CommandResult> Insert(CriarFornecedorCommand cmd)
    {
        if (cmd.DadosBancarios == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
        
        var fornecedor = new Fornecedor();
        cmd.GuidReferencia = null;

        try
        {
            BindFornecedorData(cmd, ref fornecedor);

            fornecedor.IdDadoBancarioNavigation = new DadoBancario
            {
                GuidReferencia = fornecedor.GuidReferencia,
                Banco = cmd.DadosBancarios.Banco,
                IdBanco = cmd.DadosBancarios.IdBanco,
                Agencia = cmd.DadosBancarios.Agencia,
                Conta = cmd.DadosBancarios.Conta,
                Operacao = cmd.DadosBancarios.Operacao,
                ChavePix = cmd.DadosBancarios.ChavePix,
                DataCriacao = DateTime.Now
            };

            FornecedorRepository.Insert(fornecedor);
            
            if (cmd.Contato != null)
            {
                cmd.Contato.GuidFornecedorReferencia = fornecedor.GuidReferencia;
                await contatoService.Insert(cmd.Contato);
            }

            return new CommandResult(true, SuccessResponseEnums.Success_1000, fornecedor);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
        }
        return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
    }

    public async Task<CommandResult> Update(Guid uuid, CriarFornecedorCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var fornecedor = await FornecedorRepository.GetByReferenceGuid(uuid);

        if (fornecedor == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        cmd.GuidReferencia = uuid;
        fornecedor.GuidReferencia = uuid;
        BindFornecedorData(cmd, ref fornecedor);

        try
        {
            FornecedorRepository.Update(fornecedor);
            if(cmd.DadosBancarios != null)
            {
                cmd.DadosBancarios.Id = fornecedor.IdDadoBancario;
                var dadoBancario = await DadoBancarioService.Update(cmd.DadosBancarios);
            }

            return new CommandResult(true, SuccessResponseEnums.Success_1001, fornecedor);
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

        var fornecedor = await FornecedorRepository.GetByReferenceGuid(uuid);

        if (fornecedor == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        fornecedor.Status = status;

        try
        {
            FornecedorRepository.Update(fornecedor);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, fornecedor);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }

    public async Task<CommandResult> Delete(int? codigo)
    {
        if (!codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }
        else
        {
            var _Fornecedor = await Task.FromResult(FornecedorRepository.GetById(codigo.Value));

            if(_Fornecedor == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                FornecedorRepository.Delete(codigo.Value);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception e)
            {
                logger.LogError(e.Message);
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }
        }
    }

    private static void BindFornecedorData(CriarFornecedorCommand cmd, ref Fornecedor Fornecedor)
    {
        switch (Fornecedor.GuidReferencia)
        {
            case null:
                Fornecedor.GuidReferencia = Guid.NewGuid();
                Fornecedor.DataCriacao = DateTime.Now;
                Fornecedor.DataUltimaModificacao = DateTime.Now;
                Fornecedor.Status = true;
                cmd.Status = true;
                break;
            default:
                Fornecedor.GuidReferencia = Fornecedor.GuidReferencia;
                Fornecedor.DataUltimaModificacao = DateTime.Now;
                Fornecedor.Status = true;
                break;
        }
        
        Fornecedor.Nome = cmd.Nome;
        Fornecedor.RazaoSocial  = string.Empty.Equals(cmd.RazaoSocial)
            ? cmd.Nome
            : cmd.RazaoSocial;
        Fornecedor.Nome         = cmd.Nome;
        Fornecedor.CpfCnpj      = cmd.CpfCnpj;
        Fornecedor.RazaoSocial  = cmd.RazaoSocial;
        Fornecedor.Endereco     = cmd.Endereco;
        Fornecedor.Bairro       = cmd.Bairro;
        Fornecedor.Cidade       = cmd.Cidade;
        Fornecedor.Estado       = cmd.Estado;
        Fornecedor.Cep          = cmd.Cep.HasValue ? cmd.Cep.Value : 0;
        Fornecedor.Telefone     = cmd.Telefone;
        Fornecedor.Email       = cmd.Email;
    }
}