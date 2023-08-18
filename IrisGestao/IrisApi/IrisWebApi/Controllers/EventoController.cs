using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[ApiController]
public class EventoController : Controller
{
    private readonly IEventoService eventoService;

    public EventoController(IEventoService EventoService)
    {
        this.eventoService = EventoService;
    }
 
    [HttpGet]
    public async Task<IActionResult> GetAll(
      [FromQuery] int? limit = 10
    , [FromQuery] int? page = 1)
       => Ok(await eventoService.GetAllPaging(limit ?? 10, page ?? 1));


    [HttpGet("{codigo}/id/")]
    public async Task<IActionResult> BuscarEvento([FromRoute] int codigo) =>
        Ok(await eventoService.GetById(codigo));

    [HttpGet("{codigo}/idImovel/")]
    public async Task<IActionResult> BuscarEventoPorIdImovel([FromRoute] int codigo) =>
        Ok(await eventoService.BuscarEventoPorIdImovel(codigo));

    [HttpGet("{codigo}/idCliente/")]
    public async Task<IActionResult> BuscarEventoPorIdCliente([FromRoute] int codigo) =>
        Ok(await eventoService.BuscarEventoPorIdCliente(codigo));

    [HttpPost("criar")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarEventoCommand cmd)
    {
        var result = await eventoService.Insert(cmd);

        return Ok(result);
    }

    [HttpPut("{codigo}/atualizar/")]
    public async Task<IActionResult> Atualizar(Guid uuid, [FromBody] CriarEventoCommand cmd)
    {
        var result = await eventoService.Update(uuid, cmd);

        return Ok(result);
    }

    [HttpDelete("{codigo}/deletar/")]
    public async Task<IActionResult> Deletar(Guid uuid)
    {
        var result = await eventoService.Delete(uuid);

        return Ok(result);
    }
    
    [HttpGet("lista-imoveis")]
    public async Task<IActionResult> GetProperties() =>
        Ok(await eventoService.GetAllProperties());
    
    [HttpGet("lista-locadores")]
    public async Task<IActionResult> GetRenters() =>
        Ok(await eventoService.GetAllRenters());
}

