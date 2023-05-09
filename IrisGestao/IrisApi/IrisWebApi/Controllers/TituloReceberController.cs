using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TituloReceberController : Controller
{
    private readonly ITituloReceberService tituloReceberService;

    public TituloReceberController(ITituloReceberService tituloRecebeService)
    {
        this.tituloReceberService = tituloRecebeService;
    }

    // GET
    [HttpGet]
    public async Task<IActionResult> GetAll(
       [FromQuery] int? idTipoTitulo
       , [FromQuery] string? numeroTitulo
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>
        Ok(await tituloReceberService.GetAllPaging(numeroTitulo, idTipoTitulo, limit ?? 10, page ?? 1));

    // GET
    [HttpGet("{guid}/guid")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuidCliente([FromRoute] Guid guid) =>
        Ok(await tituloReceberService.GetByGuid(guid));

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarTituloReceberCommand cmd) =>
        Ok(await tituloReceberService.Insert(cmd));

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
    Guid guid,
    [FromBody] CriarTituloReceberCommand cmd)
    {
        var result = await tituloReceberService.Update(guid, cmd);

        return Ok(result);
    }


    /*    
        [HttpGet("{guid}/fornecedor")]
        [Produces("application/json")]
        public async Task<IActionResult> GetByGuidFornecedor([FromRoute] Guid guid) =>
            Ok(await tituloReceberService.GetByGuidFornecedor(guid));

        [HttpDelete("{guid}/deletar")]
        [Produces("application/json")]
        public async Task<IActionResult> Deletar(Guid guid)
        {
            var result = await tituloReceberService.Delete(guid);

            return Ok(result);
        }
    */
}