using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[ApiController]
public class ContratoAluguelController : Controller
{
    private readonly IContratoAluguelService contratoAluguelService;

    public ContratoAluguelController(IContratoAluguelService contratoAluguelService)
    {
        this.contratoAluguelService = contratoAluguelService;
    }


    [HttpGet("{guid}/Unidades")]
    public async Task<IActionResult> GetUnidadesByContrato([FromRoute] Guid guid) =>
        Ok(await contratoAluguelService.GetUnidadesByContrato(guid));

    [HttpGet("{guid}/guid/")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await contratoAluguelService.GetByGuid(guid));

    [HttpGet]
    public async Task<IActionResult> GetAll(
       [FromQuery] int? idTipoImovel
       , [FromQuery] int? idBaseReajuste
       , [FromQuery] DateTime? dthInicioVigencia
       , [FromQuery] DateTime? dthFimVigencia
       , [FromQuery] string? numeroContrato
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await contratoAluguelService.GetAllPaging(idTipoImovel,
            idBaseReajuste,
            dthInicioVigencia,
            dthFimVigencia,
            numeroContrato,
            limit ?? 10,
            page ?? 1));

    [HttpPost("criar")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarContratoAluguelCommand cmd) =>
        Ok(await contratoAluguelService.Insert(cmd));


    [HttpPut("{guid}/atualizar")]
    public async Task<IActionResult> Atualizar(
        Guid guid,
        [FromBody] CriarContratoAluguelCommand cmd)
    {
        var result = await contratoAluguelService.Update(guid, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("{guid}/{status}/alterar-status")]
    public async Task<IActionResult> AlterarStatus(
    Guid guid,
    bool status)
    {
        var result = await contratoAluguelService.AlterarStatus(guid, status);

        return Ok(result);
    }

    [HttpPost("{guid}/{percentual}/reajustar-contrato")]
    public async Task<IActionResult> ReajustarContrato(
    Guid guid,
    double percentual)
    {
        var result = await contratoAluguelService.ReajusteContrato(guid, percentual);

        return Ok(result);
    }
    
    [HttpGet("lista-proprietarios")]
    public async Task<IActionResult> GetProprietarios() =>
        Ok(await contratoAluguelService.GetAllActiveOwners());
    
    [HttpGet("lista-imoveis")]
    public async Task<IActionResult> GetImoveis() =>
        Ok(await contratoAluguelService.GetAllActiveProperties());
}