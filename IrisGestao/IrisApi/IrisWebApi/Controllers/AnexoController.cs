using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnexoController : Controller
{
    private readonly IAnexoService anexoService;

    public AnexoController(IAnexoService anexoService)
    {
        this.anexoService = anexoService;
    }

    // GET
    [HttpGet("/api/[controller]/GetAll")]
    [Produces("application/json")]
    public async Task<IActionResult> GetAll() =>
        Ok(await anexoService.GetAll());

    // GET
    [HttpGet("/api/[controller]/GetByIdReferencia/{idRefencia}/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByIdReferencia([FromRoute] Guid idRefencia) =>
        Ok(await anexoService.GetByIdReferencia(idRefencia));
}