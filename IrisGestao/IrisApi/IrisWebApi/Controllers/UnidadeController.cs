using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UnidadeController : Controller
{
    private readonly IUnidadeService unidadeService;

    public UnidadeController(IUnidadeService unidadeService)
    {
        this.unidadeService = unidadeService;
    }
 
    // GET
    [HttpGet]
    [Produces("application/json")]
   public async Task<IActionResult> GetAll() =>
        Ok(await unidadeService.GetAll());

    // GET
    [HttpGet("{guid}/guid")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByUid([FromRoute] Guid guid) =>
        Ok(await unidadeService.GetByUid(guid));

    // GET
    [HttpGet("{codigo}/idImovel")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarBuscarUnidadePorImovel([FromRoute] int codigo) =>
        Ok(await unidadeService.BuscarBuscarUnidadePorImovel(codigo));


    [HttpPost("{guid}/criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Insert(
        Guid guid,
        [FromBody] CriarUnidadeCommand cmd)
    {
        var result = await unidadeService.Insert(guid, cmd);

        return Ok(result);
    }

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
        Guid guid,
        [FromBody] CriarUnidadeCommand cmd)
    {
        var result = await unidadeService.Update(guid, cmd);

        return Ok(result);
    }

    [HttpDelete("{codigo}/deletar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await unidadeService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
    
    [HttpPut("{guid}/duplicar")]
    [Produces("application/json")]
    public async Task<IActionResult> Clone(
        Guid guid)
    {
        var result = await unidadeService.Clone(guid);

        return Ok(result);
    }
}