using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClienteController : Controller
{
    private readonly IClienteService clienteService;

    public ClienteController(IClienteService clienteService)
    {
        this.clienteService = clienteService;
    }
 
    // GET
    [HttpGet]
    [Produces("application/json")]
   public async Task<IActionResult> GetAllPaging(
       [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await clienteService.GetAllPaging(limit ?? 10, page ?? 1));

    // GET
    [HttpGet("{guid}/guid/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await clienteService.GetByGuid(guid));

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarClienteCommand cmd)
    {
        var result = await clienteService.Insert(cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("{codigo}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(int? codigo, [FromBody] CriarClienteCommand cmd)
    {
        var result = await clienteService.Update(codigo, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpDelete("{codigo}/deletar")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await clienteService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
}

