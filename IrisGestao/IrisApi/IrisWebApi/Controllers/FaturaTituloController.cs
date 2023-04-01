using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FaturaTituloController : Controller
{
    private readonly IFaturaTituloService faturaTituloService;

    public FaturaTituloController(IFaturaTituloService FaturaTituloService)
    {
        this.faturaTituloService = FaturaTituloService;
    }

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
    Guid guid,
    [FromBody] BaixaDeFaturaCommand cmd)
    {
        var result = await faturaTituloService.Update(guid, cmd);

        return Ok(result);
    }
}