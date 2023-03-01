using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class AnexoService: IAnexoService
{
    private readonly IAnexoRepository anexoRepository;
    private readonly IAzureStorageService azureStorageService;
    private readonly ILogger<AnexoService> logger;
    
    public AnexoService(
        IAnexoRepository anexoRepository,
        IAzureStorageService azureStorageService,
        ILogger<AnexoService> logger)
    {
        this.anexoRepository = anexoRepository;
        this.azureStorageService = azureStorageService;
        this.logger = logger;
    }

    public async Task<CommandResult> GetAll()
    {
        var Anexos = await Task.FromResult(anexoRepository.GetAll());

        return !Anexos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Anexos);
    }


    public async Task<CommandResult> GetById(int codigo)
    {
        var Anexo = await Task.FromResult(anexoRepository.GetById(codigo));

        return Anexo == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Anexo);
    }

    public async Task<CommandResult> GetByIdReferencia(Guid idReferencia)
    {
        var Anexos = await anexoRepository.BuscarAnexoPorIdReferencia(idReferencia);

        return !Anexos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, Anexos);
    }

    public async Task<CommandResult> Insert(CriarAnexoCommand cmd)
    {
        try
        {
            IList<string> files = new List<string>();
            foreach (var file in cmd.Images)
            {
                var fileUri = await azureStorageService.UploadBase64data(file.ImageBinary!, cmd.Nome, "", "assets");
                if (string.IsNullOrEmpty(fileUri))
                    continue;

                files.Add(fileUri);
                anexoRepository.Insert(new Anexo
                {
                    GuidReferencia      = cmd.IdReferencia,
                    Local               = fileUri,
                    Nome                = cmd.Nome,
                    MimeType            = cmd.MimeType,
                    Tamanho             = cmd.Tamanho,
                    DataCriacao         = DateTime.Now
                });
            }
            
            return files.Count > 0
                ? new CommandResult(true, SuccessResponseEnums.Success_1000, files)
                : new CommandResult(false, ErrorResponseEnums.Error_1000, files);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(int? codigo, CriarAnexoCommand cmd)
    {
        if (cmd == null || !codigo.HasValue)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1006, null!);
        }

        var anexo = new Anexo
        {
            Id                  = codigo.Value,
            Nome                = cmd.Nome,
            GuidReferencia      = cmd.IdReferencia,
            Local               = cmd.Local,
            Classificacao       = cmd.Classificacao,
            MimeType            = cmd.MimeType,
            Tamanho             = cmd.Tamanho
        };

        try
        {
            anexoRepository.Update(anexo);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, anexo);
        }
        catch (Exception)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
            throw;
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
            var _anexo = await Task.FromResult(anexoRepository.GetById(codigo.Value));

            if (_anexo == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            try
            {
                anexoRepository.Delete(codigo.Value);
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