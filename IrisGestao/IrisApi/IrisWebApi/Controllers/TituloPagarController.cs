using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TituloPagarController : Controller
{
    private readonly ITituloPagarService TituloPagarService;

    public TituloPagarController(ITituloPagarService tituloPagarService)
    {
        this.TituloPagarService = tituloPagarService;
    }

    // GET
    [HttpGet]
    public async Task<IActionResult> GetAll(
       [FromQuery] int? idTipoTitulo
       , [FromQuery] string? nomeProprietario
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await TituloPagarService.GetAllPaging(nomeProprietario, idTipoTitulo, limit ?? 10, page ?? 1));

    // GET
    [HttpGet("{guid}/guid")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuidCliente([FromRoute] Guid guid) =>
        Ok(await TituloPagarService.GetByGuid(guid));

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarTituloPagarCommand cmd) =>
        Ok(await TituloPagarService.Insert(cmd));

    // GET
    [HttpGet("imoveisTitulo")]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllImoveisTitulo() =>
        Ok(await TituloPagarService.GetAllImoveisTitulo());

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
    Guid guid,
    [FromBody] CriarTituloPagarCommand cmd)
    {
        var result = await TituloPagarService.Update(guid, cmd);

        return Ok(result);
    }


    /*    
        [HttpGet("{guid}/fornecedor")]
        [Produces("application/json")]
        public async Task<IActionResult> GetByGuidFornecedor([FromRoute] Guid guid) =>
            Ok(await TituloPagarService.GetByGuidFornecedor(guid));

        [HttpDelete("{guid}/deletar")]
        [Produces("application/json")]
        public async Task<IActionResult> Deletar(Guid guid)
        {
            var result = await TituloPagarService.Delete(guid);

            return Ok(result);
        }
    */
}