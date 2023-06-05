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
    public async Task<IActionResult> GetFinancialVacancy(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel
        ) =>
        Ok(await contratoAluguelService.GetDashbaordFinancialVacancy(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdTipoImovel));
    
    [HttpGet("physical-vacancy")]
    public async Task<IActionResult> GetPhysicalVacancy(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel) =>
        Ok(await contratoAluguelService.GetDashbaordFinancialVacancy(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdTipoImovel));
    
    [HttpGet("receiving-performance")]
    public async Task<IActionResult> GetReceivingPerformance(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel) =>
        Ok(await contratoAluguelService.GetDashbaordFinancialVacancy(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdTipoImovel));
    
    [HttpGet("area-price")]
    public async Task<IActionResult> GetAreaPrice(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel) =>
        Ok(await contratoAluguelService.GetDashbaordFinancialVacancy(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdTipoImovel));
    
    [HttpGet("total-managed-area")]
    public async Task<IActionResult> GetTotalManagedArea(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdTipoImovel
        ) =>
        Ok(await contratoAluguelService.GetDashboardTotalManagedArea(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdTipoImovel));
}