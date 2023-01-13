using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
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

    // GET
    [HttpGet("/api/[controller]")]
    [Produces("application/json")]
    public async Task<IActionResult> GetAll() =>
        Ok(await anexoService.GetAll());

    // GET
    [HttpGet("/api/[controller]/{codigo}/id/")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarAnexo([FromRoute] int codigo) =>
        Ok(await anexoService.GetById(codigo));


    // GET
    [HttpGet("/api/[controller]/{idRefencia}/idRefencia")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByIdReferencia([FromRoute] string idRefencia) =>
        Ok(await anexoService.GetByIdReferencia(idRefencia));


    [HttpPost("/api/[controller]/criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Post([FromBody] CriarAnexoCommand cmd)
    {
        var result = await anexoService.Insert(cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }


    [HttpPut("/api/[controller]/{codigo}/atualizar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(int? codigo, [FromBody] CriarAnexoCommand cmd)
    {
        var result = await anexoService.Update(codigo, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpDelete("/api/[controller]/{codigo}/deletar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await anexoService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
}