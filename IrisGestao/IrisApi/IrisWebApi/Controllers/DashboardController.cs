using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly IContratoAluguelService contratoAluguelService;
    
    public DashboardController(IContratoAluguelService contratoAluguelService)
    {
        this.contratoAluguelService = contratoAluguelService;
    }
    
    [HttpGet("financial-vacancy")]
    public async Task<IActionResult> GetFinancialVacancy([FromBody] ConsultaDashboardCommand cmd) =>
        Ok(await contratoAluguelService.GetDashbaordFinancialVacancy(cmd));
    
    // [HttpGet("physical-vacancy")]
    // public async Task<IActionResult> GetPhysicalVacancy([FromBody] ConsultaDashboardCommand cmd) =>
    //     Ok(await contratoAluguelService.GetDashboardPhysicalVacancy(cmd));
    //
    // [HttpGet("receiving-performance")]
    // public async Task<IActionResult> GetReceivingPerformance([FromBody] ConsultaDashboardCommand cmd) =>
    //     Ok(await contratoAluguelService.GetDashboardReceivingPerformance(cmd));
    //
    // [HttpGet("area-price")]
    // public async Task<IActionResult> GetAreaPrice([FromBody] ConsultaDashboardCommand cmd) =>
    //     Ok(await contratoAluguelService.GetDashboardAreaPrice(cmd));
    //
    // [HttpGet("total-managed-area")]
    // public async Task<IActionResult> GetTotalManagedArea([FromBody] ConsultaDashboardCommand cmd) =>
    //     Ok(await contratoAluguelService.GetDashboardTotalManagedArea(cmd));
}