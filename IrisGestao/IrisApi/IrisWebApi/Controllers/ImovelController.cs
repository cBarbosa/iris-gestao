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
    [HttpGet]
    [Produces("application/json")]
   public async Task<IActionResult> GetAll(
       [FromQuery] int? idCategoria
       , [FromQuery] string? nome
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await imovelService.GetAllPaging(idCategoria, nome, limit ?? 10, page ?? 1));

    // GET
    [HttpGet("{codigo}/id/")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarImovel([FromRoute] int codigo) =>
        Ok(await imovelService.GetById(codigo));

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarImovelCommand cmd)
    {
        var result = await imovelService.Insert(cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("{codigo}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(int? codigo, [FromBody] CriarImovelCommand cmd)
    {
        var result = await imovelService.Update(codigo, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpDelete("{codigo}/deletar")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await imovelService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
}