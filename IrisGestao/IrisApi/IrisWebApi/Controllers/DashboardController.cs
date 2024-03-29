﻿using IrisGestao.ApplicationService.Services.Interface;
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
        [FromQuery] int? IdTipoArea
        ) =>
        Ok(await contratoAluguelService.GetDashbaordFinancialVacancy(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdTipoArea));
    
    [HttpGet("physical-vacancy")]
    public async Task<IActionResult> GetPhysicalVacancy(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador) =>
        Ok(await contratoAluguelService.GetDashbaordPhysicalVacancy(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador));
    
    [HttpGet("receiving-performance")]
    public async Task<IActionResult> GetReceivingPerformance(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador) =>
        Ok(await contratoAluguelService.GetDashbaordReceivingPerformance(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador));
    
    [HttpGet("area-price")]
    public async Task<IActionResult> GetAreaPrice(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador,
        [FromQuery] int? IdImovel) =>
        Ok(await contratoAluguelService.GetDashbaordAreaPrice(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador, IdImovel));
    
    [HttpGet("total-managed-area")]
    public async Task<IActionResult> GetTotalManagedArea(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador
        ) =>
        Ok(await contratoAluguelService.GetDashboardTotalManagedArea(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador));
    
    [HttpGet("total-managed-area-stack")]
    public async Task<IActionResult> GetTotalManagedAreaStack(
        [FromQuery] DateTime? DateRefInit,
        [FromQuery] DateTime? DateRefEnd,
        [FromQuery] int? IdLocador
    ) =>
        Ok(await contratoAluguelService.GetDashboardTotalManagedAreaStack(DateRefInit ?? DateTime.Now, DateRefEnd ?? DateTime.Now.AddMonths(12), IdLocador));
}