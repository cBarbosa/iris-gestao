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
        [FromQuery] int? IdLocatario
    ) =>
        Ok(await contratoAluguelService.GetReportLeasedArea(IdImovel, IdLocatario));
    
    [HttpGet("rent-value")]
    public async Task<IActionResult> GetRentValue(
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdLocatario,
        [FromQuery] DateTime? DateRef
    ) =>
        Ok(await contratoAluguelService.GetReportRentValue(IdImovel, IdLocador, IdLocatario, DateRef));
    
    [HttpGet("expenses")]
    public async Task<IActionResult> GetExpenses(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdLocatario
    ) =>
        Ok(await contratoAluguelService.GetReportExpenses(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdImovel, IdLocador, IdLocatario));
    
    [HttpGet("revenues")]
    public async Task<IActionResult> GetRevenues(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdLocatario
    ) =>
        Ok(await contratoAluguelService.GetReportRevenues(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdImovel, IdLocador, IdLocatario));
    
    [HttpGet("supply-contract")]
    public async Task<IActionResult> GetSupplyContract(
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdLocatario
    ) =>
        Ok(await contratoAluguelService.GetReportSupplyContract(IdImovel, IdLocador, IdLocatario));
    
    [HttpGet("rent-contract")]
    public async Task<IActionResult> GetRentContract(
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdLocatario
    ) =>
        Ok(await contratoAluguelService.GetReportRentContract(IdImovel, IdLocador));

    [HttpGet("dimob")]
    public async Task<IActionResult> GetDimob(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdLocatario
    ) =>
        Ok(await contratoAluguelService.GetReportDimob(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdLocatario));
    
    [HttpGet("commercial")]
    public async Task<IActionResult> GetCommercial(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdImovel,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdLocatario
    ) =>
        Ok(await contratoAluguelService.GetReportCommercial(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdImovel, IdLocador, IdLocatario));
}