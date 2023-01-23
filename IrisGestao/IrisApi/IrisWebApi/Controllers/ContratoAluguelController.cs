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


    /*

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
    Guid guid,
    [FromBody] CriarContratoAluguelCommand cmd)
    {
        var result = await contratoAluguelService.Update(guid, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpDelete("{guid}/deletar")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(Guid guid)
    {
        var result = await contratoAluguelService.Delete(guid);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
    */

}