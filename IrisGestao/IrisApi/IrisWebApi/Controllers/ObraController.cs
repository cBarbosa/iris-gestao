using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[ApiController]
public class ObraController : Controller
{
    private readonly IObraService obraService;

    public ObraController(IObraService obraService)
    {
        this.obraService = obraService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? idTipoConta
        , [FromQuery] int? idTipoImovel
        , [FromQuery] string? nome
        , [FromQuery] int? limit = 10
        , [FromQuery] int? page = 1) =>
        Ok(await obraService.GetAllPaging(idTipoConta, idTipoImovel, nome, limit ?? 10, page ?? 1));
    
    [HttpGet("{guid}/guid")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await obraService.GetByReferenceGuid(guid));
    
    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] CriarObraCommand cmd) =>
        Ok(await obraService.Insert(cmd));

    [HttpPut("{guid}")]
    public async Task<IActionResult> Update(
        [FromRoute] Guid guid,
        [FromBody] CriarObraCommand cmd) =>
        Ok(await obraService.Update(guid, cmd));
    
    [HttpPost("{guid}/notafiscal")]
    public async Task<IActionResult> Insert(
        [FromRoute] Guid guid,
        [FromBody] CriarObraNotaFiscalCommand cmd) =>
        Ok(await obraService.InsertNotaFiscal(guid, cmd));
    
    [HttpGet("notafiscal/{guid}")]
    public async Task<IActionResult> GetNotaFiscalByGuid([FromRoute] Guid guid) =>
        Ok(await obraService.GetNotaFiscalByGuid(guid));
    
    [HttpPut("notafiscal/{guid}")]
    public async Task<IActionResult> UpdateNotaFiscal(
        [FromRoute] Guid guid,
        [FromBody] CriarObraNotaFiscalCommand cmd) =>
        Ok(await obraService.UpdateNotaFiscal(guid, cmd));
}