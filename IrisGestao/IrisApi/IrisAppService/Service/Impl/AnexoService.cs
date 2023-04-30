using System.Text.RegularExpressions;
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
        var anexos = await Task.FromResult(anexoRepository.GetAll());

        return !anexos.Any()
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, anexos);
    }

    public async Task<CommandResult> GetById(int codigo)
    {
        var anexo = await Task.FromResult(anexoRepository.GetById(codigo));

        return anexo == null
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, anexo);
    }

    public async Task<CommandResult> GetByIdReferencia(Guid uid)
    {
        try
        {
            var anexos = await anexoRepository.GetByGuid(uid);

            return new CommandResult(true, SuccessResponseEnums.Success_1005, anexos);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1005, null!);
        }
        
    }

    public async Task<CommandResult> Insert(CriarAnexoCommand cmd)
    {
        #region valida extensões
        string[] fotoExtensoes = {".png", ".jpg", ".jpeg", ".svn", ".gif"};
        string[] documentoExtensoes = {".xls", ".doc", ".pdf", ".xlsx", ".docx", ".dwg"};

        var validaFotos = cmd.Classificacao.Equals("capa")
                          || cmd.Classificacao.Equals("foto");
        var validaDocumentos = cmd.Classificacao.Equals("habitese")
                               || cmd.Classificacao.Equals("projeto")
                               || cmd.Classificacao.Equals("matricula")
                               || cmd.Classificacao.Equals("outrosdocs");

        if ((from file in cmd.Images
                select Regex.Match(file.ImageName!.ToLower(), @"\.([a-zA-Z0-9]+)$")
                into match
                where match.Success
                select match.Groups[1]?.Value.ToLower()
                into extensao
                select validaFotos
                    ? fotoExtensoes.Contains($".{extensao}")
                    : validaDocumentos & documentoExtensoes.Contains($".{extensao}")).Any(isValid => !isValid))
        {
            return new CommandResult(false, "Este tipo de arquivo não pode ser enviado", null!);
        }
        #endregion

        IList<string> azureFiles = new List<string>();
        foreach (var file in cmd.Images)
        {
            var fileUri =
                await azureStorageService.UploadBase64data(file.ImageBinary!,
                    file.ImageName!,
                    $"{cmd.IdReferencia}",
                    "assets");

            if (string.IsNullOrEmpty(fileUri))
                continue;

            azureFiles.Add(fileUri);
        }

        if (azureFiles.Count < cmd.Images.Count)
        {
            return new CommandResult(false, 
                "O(s) arquivo(s) pode(m) já ter sido enviado com este nome anteriormente." +
                " Para corrigir verifique o(s) arquivo(s) e teste novamente",
                azureFiles);
        }

        try
        {
            SaveOnDatabase(cmd, azureFiles);

            return azureFiles.Count > 0
                ? new CommandResult(true, SuccessResponseEnums.Success_1000, azureFiles)
                : new CommandResult(false, "Erro no upload de arquivos", azureFiles);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1000, null!);
        }
    }

    public async Task<CommandResult> Update(int codigo, CriarAnexoCommand cmd)
    {
        var anexo = await Task.FromResult(anexoRepository.GetById(codigo));

        if (anexo == null)
        {
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }

        anexo!.Classificacao = cmd.Classificacao;

        try
        {
            anexoRepository.Update(anexo!);
            return new CommandResult(true, SuccessResponseEnums.Success_1001, anexo!);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1001, null!);
        }
    }


    public async Task<CommandResult> Delete(int codigo)
    {
        try
        {
            var anexo = await Task.FromResult(anexoRepository.GetById(codigo));

            if (anexo == null)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }
            
            var result = await azureStorageService.DeleteBlobFile(
                anexo.Nome,
                $"{anexo.GuidReferencia}",
                "assets");

            if (!result)
            {
                return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
            }

            anexoRepository.Delete(codigo);
            return new CommandResult(true, SuccessResponseEnums.Success_1002, null!);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new CommandResult(false, ErrorResponseEnums.Error_1002, null!);
        }
    }
    
    private void SaveOnDatabase(CriarAnexoCommand cmd, IList<string> azureFiles)
    {
        var index = 0;
        foreach (var file in cmd.Images)
        {
            anexoRepository.Insert(new Anexo
            {
                GuidReferencia = cmd.IdReferencia,
                Classificacao = cmd.Classificacao,
                Local = azureFiles[index++],
                Nome = file.ImageName!,
                MimeType = file.MimeType,
                Tamanho = file.ImageSize,
                DataCriacao = DateTime.Now
            });
        }
    }
}