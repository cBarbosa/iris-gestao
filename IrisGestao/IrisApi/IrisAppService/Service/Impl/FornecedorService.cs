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
        var fornecedor = new Fornecedor();
        var contato = new Contato();
        var dadosBancarios = new DadoBancario();
        cmd.GuidReferencia = null;

        try
        {
            BindFornecedorData(cmd, ref fornecedor);
            if (dadosBancarios != null)
            {
                var dadoBancario = await DadoBancarioService.Insert(cmd.DadosBancarios);
                dadosBancarios = (DadoBancario)dadoBancario.Data;
                fornecedor.IdDadoBancario = dadosBancarios.Id;
            }

            FornecedorRepository.Insert(fornecedor);

            if (cmd.Contato != null)
            {
                contato.IdFornecedor = fornecedor.Id;
                var contatoFornecedor = await contatoService.Insert(cmd.Contato);
            }

            return new CommandResult(true, SuccessResponseEnums.Success_1000, fornecedor);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarFornecedorCommand cmd)
    {
        var fornecedor = new Fornecedor();
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var Fornecedor = await FornecedorRepository.GetByReferenceGuid(uuid);

        if (Fornecedor == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        cmd.GuidReferencia = uuid;
        BindFornecedorData(cmd, ref fornecedor);

        try
        {
            FornecedorRepository.Update(Fornecedor);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, Fornecedor);
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

        var Fornecedor = await FornecedorRepository.GetByReferenceGuid(uuid);

        if (Fornecedor == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        Fornecedor.Status = status;

        try
        {
            FornecedorRepository.Update(Fornecedor);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, Fornecedor);
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
                break;
            default:
                Fornecedor.GuidReferencia = Fornecedor.GuidReferencia;
                Fornecedor.DataUltimaModificacao = DateTime.Now;
                break;
        }
        
        Fornecedor.Nome = cmd.Nome;
        Fornecedor.RazaoSocial = string.Empty.Equals(cmd.RazaoSocial)
            ? cmd.Nome
            : cmd.RazaoSocial;
        Fornecedor.Nome = cmd.Nome;
        Fornecedor.RazaoSocial = cmd.RazaoSocial;
        Fornecedor.Endereco = cmd.Endereco;
        Fornecedor.Bairro = cmd.Bairro;
        Fornecedor.Cidade = cmd.Cidade;
        Fornecedor.Estado = cmd.Estado;
        Fornecedor.Cep = cmd.Cep.HasValue ? cmd.Cep.Value : 0; 
        Fornecedor.Status = cmd.Status;
    }
}