using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContratoAluguelController : Controller
{
    private readonly IContratoAluguelService contratoAluguelService;

    public ContratoAluguelController(IContratoAluguelService contratoAluguelService)
    {
        this.contratoAluguelService = contratoAluguelService;
    }

    [HttpGet("{guid}/guid/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await contratoAluguelService.GetByGuid(guid));

    [HttpGet]
    [Produces("application/json")]
    public async Task<IActionResult> GetAll(
       [FromQuery] int? idTipoImovel
       , [FromQuery] int? idBaseReajuste
       , [FromQuery] DateTime? dthInicioVigencia
       , [FromQuery] DateTime? dthFimVigencia
       , [FromQuery] string? numeroContrato
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await contratoAluguelService.GetAllPaging(idTipoImovel, idBaseReajuste, dthInicioVigencia, dthFimVigencia, numeroContrato, limit ?? 10, page ?? 1));

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarContratoAluguelCommand cmd) =>
        Ok(await contratoAluguelService.Insert(cmd));

    [HttpPut("{guid}/{status}/alterar-status")]
    [Produces("application/json")]
    public async Task<IActionResult> AlterarStatus(
    Guid guid,
    bool status)
    {
        var result = await contratoAluguelService.AlterarStatus(guid, status);

        return Ok(result);
    }

    [HttpPost("{guid}/{percentual}/reajustar-contrato")]
    [Produces("application/json")]
    public async Task<IActionResult> ReajustarContrato(
    Guid guid,
    double percentual)
    {
        var result = await contratoAluguelService.ReajusteContrato(guid, percentual);

        return Ok(result);
    }
}