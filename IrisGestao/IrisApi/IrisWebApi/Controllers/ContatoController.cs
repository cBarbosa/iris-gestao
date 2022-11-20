using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContatoController : Controller
{
    private readonly IContatoService contatoService;

    public ContatoController(IContatoService contatoService)
    {
        this.contatoService = contatoService;
    }
    
    // GET
    public async Task<IActionResult> Get() =>
        Ok(contatoService.GetAll());
}