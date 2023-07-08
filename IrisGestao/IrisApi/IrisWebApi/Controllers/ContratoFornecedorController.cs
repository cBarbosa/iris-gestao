using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContratoFornecedorController : Controller
{
    private readonly IContratoFornecedorService contratoFornecedorService;

    public ContratoFornecedorController(IContratoFornecedorService contratoFornecedorService)
    {
        this.contratoFornecedorService = contratoFornecedorService;
    }
    [HttpGet("{guid}/guid/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await contratoFornecedorService.GetByGuid(guid));

    [HttpGet]
    [Produces("application/json")]
    public async Task<IActionResult> GetAll(
       [FromQuery] string? numeroContrato
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await contratoFornecedorService.GetAllPaging(numeroContrato, limit ?? 10, page ?? 1));
    
    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarContratoFornecedorCommand cmd) =>
        Ok(await contratoFornecedorService.Insert(cmd));

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
    Guid guid,
    [FromBody] CriarContratoFornecedorCommand cmd)
    {
        var result = await contratoFornecedorService.Update(guid, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("{guid}/{status}/alterar-status")]
    [Produces("application/json")]
    public async Task<IActionResult> AlterarStatus(
    Guid guid,
    bool status)
    {
        var result = await contratoFornecedorService.AlterarStatus(guid, status);

        return Ok(result);
    }
    
}