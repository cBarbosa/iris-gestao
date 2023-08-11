using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FaturaTituloPagarController : Controller
{
    private readonly IFaturaTituloPagarService faturaTituloPagarService;

    public FaturaTituloPagarController(IFaturaTituloPagarService FaturaTituloPagarService)
    {
        this.faturaTituloPagarService = FaturaTituloPagarService;
    }

    [HttpPost("{guid}/criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadastrar(
    Guid guid,
    [FromBody] FaturaTituloPagarCommand cmd)
    {
        var result = await faturaTituloPagarService.Insert(guid, cmd);

        return Ok(result);
    }

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
    Guid guid,
    [FromBody] FaturaTituloPagarCommand cmd)
    {
        var result = await faturaTituloPagarService.Update(guid, cmd);

        return Ok(result);
    }

    [HttpPut("{guid}/baixarFatura")]
    [Produces("application/json")]
    public async Task<IActionResult> BaixarFatura(
    Guid guid,
    [FromBody] BaixarFaturaTituloPagarCommand cmd)
    {
        var result = await faturaTituloPagarService.BaixarFatura(guid, cmd);

        return Ok(result);
    }
}