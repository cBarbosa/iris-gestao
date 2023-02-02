using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContatoController : Controller
{
    private readonly IContatoService contatoService;

    public ContatoController(IContatoService contatoService)
    {
        this.contatoService = contatoService;
    }

    [HttpGet("{guid}/guid/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await contatoService.GetByGuid(guid));

    // GET
    [HttpGet]
    public async Task<IActionResult> Get() =>
        Ok(await contatoService.GetAll());

    [HttpGet("{guid}/cliente")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuidCliente([FromRoute] Guid guid) =>
    Ok(await contatoService.GetByGuidCliente(guid));


    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarContatoCommand cmd) =>
        Ok(await contatoService.Insert(cmd));

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
    Guid guid,
    [FromBody] CriarContatoCommand cmd)
    {
        var result = await contatoService.Update(guid, cmd);

        return Ok(result);
    }

    [HttpDelete("{guid}/deletar")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(Guid guid)
    {
        var result = await contatoService.Delete(guid);

        return Ok(result);
    }
}