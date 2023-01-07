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
 
    [HttpGet]
    [Produces("application/json")]
   public async Task<IActionResult> GetAllPaging(
       [FromQuery] int? idTipo
       , [FromQuery] string? nome
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>  
        Ok(await clienteService.GetAllPaging(idTipo,nome, limit ?? 10, page ?? 1));

    [HttpGet("{guid}/guid/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await clienteService.GetByGuid(guid));

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarClienteCommand cmd) =>
        Ok(await clienteService.Insert(cmd));

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
        Guid guid,
        [FromBody] CriarClienteCommand cmd)
    {
        var result = await clienteService.Update(guid, cmd);

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
        var result = await clienteService.AlterarStatus(guid, status);

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
    
    [HttpGet("lista-proprietarios")]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllOwners() =>
        Ok(await clienteService.GetAllOwners());
}

