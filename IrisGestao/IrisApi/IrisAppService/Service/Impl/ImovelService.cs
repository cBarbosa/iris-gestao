using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ImovelService: IImovelService
{
    private readonly IImovelRepository imovelRepository;
    private readonly IImovelEnderecoRepository imovelEnderecoRepository;
    private readonly IContratoAluguelRepository ContratoAluguelRepository;
    private readonly ILogger<ImovelService> logger;
    
    public ImovelService(
        IImovelRepository imovelRepository
        , IImovelEnderecoRepository imovelEnderecoRepositor
        , IContratoAluguelRepository ContratoAluguelRepository
        , ILogger<ImovelService> logger)
    {
        this.imovelRepository = imovelRepository;
        this.imovelEnderecoRepository = imovelEnderecoRepository;
        this.ContratoAluguelRepository = ContratoAluguelRepository;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAllPaging(int? idCategoria, int? idProprietario, string? nome, int limit, int page)
    {
        var result = await imovelRepository.GetAllPaging(idCategoria, idProprietario, nome, limit, page);

        return result == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, result);
    }

    public async Task<CommandResult> GetById(int codigo)
    {
        var Imovel = await Task.FromResult(imovelRepository.GetById(codigo));

        return Imovel == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Imovel);
    }

    public async Task<CommandResult> Insert(CriarImovelCommand cmd)
    {
        var imovel = new Imovel();
        ImovelEndereco endereco = new ImovelEndereco();
        cmd.GuidReferencia = null;
        
        try
        {
            BindImoveisData(cmd, ref imovel);
            imovelRepository.Insert(imovel);
            
            BindEnderecoData(cmd, ref endereco);

            if (endereco != null)
            {
                endereco.IdImovel = imovel.Id;
                imovelEnderecoRepository.Insert(endereco);
            }

            return new CommandResult(true, SuccessResponseEnums.Success_1000, imovel);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(Guid uuid, CriarImovelCommand cmd)
    {
        if (cmd == null || uuid.Equals(Guid.Empty))
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var imovel = await imovelRepository.GetByReferenceGuid(uuid);
        
        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        cmd.GuidReferencia = uuid;
        cmd.Status = imovel.Status;

        var endereco = await imovelEnderecoRepository.GetByImovelReferenceGuid(uuid);

        try
        {
            BindImoveisData(cmd, ref imovel);
            imovelRepository.Update(imovel);
            
            if (endereco != null)
            {
                BindEnderecoData(cmd, ref endereco);
                if (endereco != null)
                {
                    imovelEnderecoRepository.Update(endereco);
                }
            }
            else
            {
                endereco = new ImovelEndereco();
                BindEnderecoData(cmd, ref endereco);
                if (endereco != null)
                {
                    endereco.IdImovel = imovel.Id;
                    imovelEnderecoRepository.Insert(endereco);
                }
            }

            return new CommandResult(true, SuccessResponseEnums.Success_1001, imovel);
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

        var imovel = await imovelRepository.GetByReferenceGuid(uuid);

        if (imovel == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
        imovel.Status = status;

        try
        {
            imovelRepository.Update(imovel);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, imovel);
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
            var _imovel = await Task.FromResult(imovelRepository.GetById(codigo.Value));

            if(_imovel == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                imovelRepository.Delete(codigo.Value);
                return new CommandResult(true, SuccessResponseEnums.Success_1002, null);
            }
            catch (Exception)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
                throw;
            }
        }
    }
    
    public async Task<CommandResult> GetByGuid(Guid guid)
    {
        var imovel = await imovelRepository.GetByGuid(guid);

        return imovel == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, imovel);
    }

    public async Task<CommandResult> GetImoveisParaContrato()
    {
        var _resultImoveis = await imovelRepository.GetImoveisContrato();
        var _resultImoveisContrato = await ContratoAluguelRepository.GetImoveisUnidadesContratoAluguelAtivos();

        string jsonResultImoveis = JsonConvert.SerializeObject(_resultImoveis);
        List<ImovelDisponivel> resultImoveis = JsonConvert.DeserializeObject<List<ImovelDisponivel>>(jsonResultImoveis);
        
        string jsonResultImoveisContrato = JsonConvert.SerializeObject(_resultImoveisContrato);
        List<ContratoAluguelImoveis> resultImoveisContrato = JsonConvert.DeserializeObject<List<ContratoAluguelImoveis>>(jsonResultImoveisContrato);



        List<ImovelDisponivel> lstImovelDisponivels = new List<ImovelDisponivel>();
        List<ImovelDisponivel> lstImovelDisponivels1 = new List<ImovelDisponivel>();
        List<ImovelDisponivel> lstImovelDisponivels2 = new List<ImovelDisponivel>();
        foreach (var imovel in resultImoveis)
        {
            foreach (var imovelContrato in resultImoveisContrato)
            {
                if(!imovel.GuidReferencia.Equals(imovelContrato.ImovelDisponivel))
                {
                    ImovelDisponivel imovelDisponivel = new ImovelDisponivel();
                    List<UnidadesDisponivel> UnidadeDisponiveis = new List<UnidadesDisponivel>();
                    imovelDisponivel.GuidReferencia = imovel.GuidReferencia;
                    imovelDisponivel.Nome = imovel.Nome;
                    imovelDisponivel.Status = imovel.Status;

                    imovelDisponivel.Unidades = UnidadeDisponiveis;

                    if(imovelDisponivel.Unidades.Count() > 0)
                        lstImovelDisponivels.Add(imovelDisponivel);
                }
            }
        }

        return lstImovelDisponivels == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, lstImovelDisponivels);
    }

    public async Task<CommandResult> Query()
    {
        var result = await imovelRepository.Query();
        return new CommandResult(true, SuccessResponseEnums.Success_1001, result);
    }

    private static void BindImoveisData(CriarImovelCommand cmd, ref Imovel imovel)
    {
        switch (imovel.GuidReferencia)
        {
            case null:
                imovel.GuidReferencia = Guid.NewGuid();
                imovel.DataCriacao = DateTime.Now;
                imovel.DataUltimaModificacao = DateTime.Now;
                imovel.Status = true;
                break;
            default:
                imovel.DataUltimaModificacao = DateTime.Now;
                break;
        }

        imovel.Nome = cmd.Nome;
        imovel.IdCategoriaImovel = cmd.IdCategoriaImovel;
        imovel.IdClienteProprietario = cmd.IdClienteProprietario;
        imovel.NumCentroCusto = cmd.NumCentroCusto;
        imovel.MonoUsuario = cmd.MonoUsuario;
        imovel.Classificacao = cmd.Classificacao;
    }

    private static void BindEnderecoData(CriarImovelCommand cmd, ref ImovelEndereco endereco)
    {
        if ((!cmd.CEP.HasValue || cmd.CEP < 1) 
            && string.IsNullOrEmpty(cmd.Rua)
            && string.IsNullOrEmpty(cmd.Cidade)
            && string.IsNullOrEmpty(cmd.Bairro)
            && string.IsNullOrEmpty(cmd.UF))
        {
            endereco = null!;
            return;
        }

        if (endereco.IdImovel > 0)
        {
            endereco.DataUltimaModificacao = DateTime.Now;
        }
        else
        {
            endereco.DataCriacao = DateTime.Now;
            endereco.DataUltimaModificacao = DateTime.Now;
        }

        endereco.Cep = cmd.CEP ?? int.MinValue;
        endereco.Rua = cmd.Rua;
        endereco.Complemento = cmd.Complemento ?? string.Empty;
        endereco.Cidade = cmd.Cidade;
        endereco.Bairro = cmd.Bairro;
        endereco.UF = cmd.UF;
    }

    public class ImovelDisponivel
    {
        public string GuidReferencia { get; set; }
        public string Nome { get; set; }
        public bool Status { get; set; }
        public List<UnidadesDisponivel> Unidades { get; set; }
    }

    public class UnidadesDisponivel
    {
        public string GuidReferencia { get; set; }
        public int IdImovel { get; set; }
        public string Tipo { get; set; }
        public bool Status { get; set; }
    }

    public class ContratoAluguelImoveis
    {
        public string NumeroContrato { get; set; }
        public bool Status { get; set; }
        public List<ImovelDisponivel> ImovelDisponivel { get; set; }
    }


}