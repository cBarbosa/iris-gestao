using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[ApiController]
public class AnexoController : Controller
{
    private readonly IAnexoService anexoService;

    public AnexoController(IAnexoService anexoService)
    {
        this.anexoService = anexoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await anexoService.GetAll());
    
    [HttpGet("{codigo}/id")]
    public async Task<IActionResult> BuscarAnexo([FromRoute] int codigo) =>
        Ok(await anexoService.GetById(codigo));
    
    [HttpGet("{uid:guid}")]
    public async Task<IActionResult> GetByIdReferencia([FromRoute] Guid uid) =>
        Ok(await anexoService.GetByIdReferencia(uid));
    
    [HttpPost("{uid:guid}/classificacao/{classificacao}")]
    public async Task<IActionResult> Post(
        [FromRoute] Guid uid,
        [FromRoute] string? classificacao,
        [FromForm]IFormFileCollection files)
    {
        if (files.Count.Equals(0)
            || string.IsNullOrEmpty(classificacao))
        {
            return Ok(await Task.FromResult(
                new CommandResult(true, 
                    "Não foi possível fazer upload do arquivo", null!)));
        }
    
        #region bind files
        var cmd = new CriarAnexoCommand
        {
            IdReferencia = uid,
            Classificacao = classificacao,
            Images = new List<ImageMessage>()
        };
    
        foreach (var file in files)
        {
            await BindFile(cmd, file);
        }
        #endregion
    
        return Ok(await anexoService.Insert(cmd));
    }
    
    [HttpPut("{codigo:int}")]
    public async Task<IActionResult> Atualizar(
        [FromRoute] int codigo,
        [FromBody] CriarAnexoCommand cmd) => 
        Ok(await anexoService.Update(codigo, cmd));
    
    [HttpDelete("{codigo:int}")]
    public async Task<IActionResult> Deletar(int codigo) =>
        Ok(await anexoService.Delete(codigo));
    
    private static async Task BindFile(
        CriarAnexoCommand cmd,
        IFormFile file)
    {
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        cmd.Images.Add(new ImageMessage
        {
            ImageName = $"{file.FileName}",
            ImageSize = (int)file.Length,
            MimeType = file.ContentType,
            ImageHeaders = $"data:{file.ContentType};base64,",
            ImageBinary = memoryStream.ToArray()
        });
    }
    
}