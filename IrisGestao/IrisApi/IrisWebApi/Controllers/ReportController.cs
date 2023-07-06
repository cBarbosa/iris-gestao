using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[ApiController]
public class ReportController : ControllerBase
{
    private readonly IContratoAluguelService contratoAluguelService;

    public ReportController(IContratoAluguelService contratoAluguelService)
    {
        this.contratoAluguelService = contratoAluguelService;
    }
    
    [HttpGet("leased-area")]
    public async Task<IActionResult> GetLeasedArea(
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel,
        [FromQuery] int? IdLocatario,
        [FromQuery] bool? Status
    ) =>
        Ok(await contratoAluguelService.GetReportLeasedArea(Status, IdImovel, IdTipoImovel, IdLocador, IdLocatario));
    
    [HttpGet("rent-value")]
    public async Task<IActionResult> GetRentValue(
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel,
        [FromQuery] int? IdLocatario,
        [FromQuery] bool? Status,
        [FromQuery] DateTime? DateRef
    ) =>
        Ok(await contratoAluguelService.GetReportRentValue(Status, IdImovel, IdTipoImovel, IdLocador, IdLocatario, DateRef));
}