using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnexoController : Controller
{
    private readonly IAnexoService anexoService;

    public AnexoController(IAnexoService anexoService)
    {
        this.anexoService = anexoService;
    }

    [HttpGet]
    [Produces("application/json")]
    public async Task<IActionResult> GetAll() =>
        Ok(await anexoService.GetAll());

    [HttpGet("{codigo}/id")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarAnexo([FromRoute] int codigo) =>
        Ok(await anexoService.GetById(codigo));


    [HttpGet("{idRefencia:guid}/idRefencia")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByIdReferencia([FromRoute] Guid uid) =>
        Ok(await anexoService.GetByIdReferencia(uid));


    [HttpPost("{idRefencia:guid}/criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Post([FromRoute] Guid uid, [FromForm]IFormFileCollection files)
    {
        var cmd = new CriarAnexoCommand();

        if (files.Count.Equals(0))
        {
            return Ok(await Task.FromResult(
                new CommandResult(true, 
                    "Não foi possível fazer upload do arquivo", null!)));
        }

        foreach (var file in files)
        {
            cmd.IdReferencia = uid;
            cmd.Nome = file.FileName;
            cmd.Tamanho = (int)file.Length;
            cmd.MimeType = file.ContentType;
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            cmd.Images.Add(new ImageMessage
            {
                ImageHeaders = $"data:{file.ContentType};base64,",
                ImageBinary = memoryStream.ToArray()
            });
        }

        return Ok(await anexoService.Insert(cmd));
    }

    [HttpPut("{codigo:int}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(int codigo, [FromBody] CriarAnexoCommand cmd) => 
        Ok(await anexoService.Update(codigo, cmd));

    [HttpDelete("{codigo:int}/deletar")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int codigo) =>
        Ok(await anexoService.Delete(codigo));
}