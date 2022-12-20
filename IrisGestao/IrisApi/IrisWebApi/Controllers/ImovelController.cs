using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ImovelController : Controller
{
    private readonly IImovelService imovelService;

    public ImovelController(IImovelService ImovelService)
    {
        this.imovelService = ImovelService;
    }
 
    // GET
    [HttpGet("/api/[controller]")]
    [Produces("application/json")]
   public async Task<IActionResult> GetAll(
              [FromQuery] int? idCategoriaImovel
            , [FromQuery] string? nome
            , [FromQuery] int? page = 1
            , [FromQuery] int? limit = 50) =>
        Ok(await imovelService.GetAll(idCategoriaImovel, nome));

    // GET
    [HttpGet("/api/[controller]/{codigo}/id/")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarImovel([FromRoute] int codigo) =>
        Ok(await imovelService.GetById(codigo));

    [HttpPost("/api/[controller]/criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarImovelCommand cmd)
    {
        var result = await imovelService.Insert(cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("/api/[controller]/{codigo}/atualizar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(int? codigo, [FromBody] CriarImovelCommand cmd)
    {
        var result = await imovelService.Update(codigo, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpDelete("/api/[controller]/{codigo}/deletar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await imovelService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
}

