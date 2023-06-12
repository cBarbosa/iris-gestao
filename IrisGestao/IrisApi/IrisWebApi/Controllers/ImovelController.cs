using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ImovelController : Controller
{
    private readonly IImovelService imovelService;

    public ImovelController(IImovelService imovelService)
    {
        this.imovelService = imovelService;
    }
 
    [HttpGet]
    [Produces("application/json")]
   public async Task<IActionResult> GetAll(
       [FromQuery] int? idCategoria
       , [FromQuery] int? idProprietario
       , [FromQuery] string? nome
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await imovelService.GetAllPaging(idCategoria, idProprietario, nome, limit ?? 10, page ?? 1));

    [HttpGet("{guid}/guid/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await imovelService.GetByGuid(guid));

    [HttpGet("BuscarImoveisDisponiveis")]
    [Produces("application/json")]
    public async Task<IActionResult> GetImoveisParaContrato() =>
    Ok(await imovelService.GetImoveisParaContrato());

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Insert([FromBody] CriarImovelCommand cmd)
    {
        var result = await imovelService.Insert(cmd);

        return Ok(result);
    }

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Update(
        Guid guid,
        [FromBody] CriarImovelCommand cmd)
    {
        var result = await imovelService.Update(guid, cmd);

        return Ok(result);
    }

    [HttpPut("{guid}/{status}/alterar-status")]
    [Produces("application/json")]
    public async Task<IActionResult> AlterarStatus(
    Guid guid,
    bool status)
    {
        var result = await imovelService.AlterarStatus(guid, status);

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