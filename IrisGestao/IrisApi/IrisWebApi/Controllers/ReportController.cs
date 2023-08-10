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
    
    [HttpGet("expenses")]
    public async Task<IActionResult> GetExpenses(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel,
        [FromQuery] int? IdLocatario,
        [FromQuery] bool? Status
    ) =>
        Ok(await contratoAluguelService.GetReportExpenses(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), Status, IdImovel, IdTipoImovel, IdLocador, IdLocatario));
    
    [HttpGet("revenues")]
    public async Task<IActionResult> GetRevenues(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel,
        [FromQuery] int? IdLocatario,
        [FromQuery] bool? Status
        ) =>
        Ok(await contratoAluguelService.GetReportRevenues(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), Status, IdImovel, IdTipoImovel, IdLocador, IdLocatario));
    
    [HttpGet("supply-contract")]
    public async Task<IActionResult> GetSupplyContract(
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel,
        [FromQuery] int? IdLocatario,
        [FromQuery] bool? Status
    ) =>
        Ok(await contratoAluguelService.GetReportSupplyContract(Status, IdImovel, IdTipoImovel, IdLocador, IdLocatario));
}