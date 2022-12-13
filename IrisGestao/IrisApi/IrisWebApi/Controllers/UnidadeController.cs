using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UnidadeController : Controller
{
    private readonly IUnidadeService unidadeService;

    public UnidadeController(IUnidadeService UnidadeService)
    {
        this.unidadeService = UnidadeService;
    }
 
    // GET
    [HttpGet("/api/[controller]")]
    [Produces("application/json")]
   public async Task<IActionResult> GetAll() =>
        Ok(await unidadeService.GetAll());

    // GET
    [HttpGet("/api/[controller]/{codigo}/id/")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarUnidade([FromRoute] int codigo) =>
        Ok(await unidadeService.GetById(codigo));


    // GET
    [HttpGet("/api/[controller]/{codigo}/idImovel/")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarBuscarUnidadePorImovel([FromRoute] int codigo) =>
        Ok(await unidadeService.BuscarBuscarUnidadePorImovel(codigo));


    [HttpPost("/api/[controller]/criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarUnidadeCommand cmd)
    {
        var result = await unidadeService.Insert(cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("/api/[controller]/{codigo}/atualizar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(int? codigo, [FromBody] CriarUnidadeCommand cmd)
    {
        var result = await unidadeService.Update(codigo, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpDelete("/api/[controller]/{codigo}/deletar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await unidadeService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
}

