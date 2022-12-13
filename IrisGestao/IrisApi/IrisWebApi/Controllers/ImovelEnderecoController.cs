using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ImovelEnderecoController : Controller
{
    private readonly IImovelEnderecoService imovelEnderecoService;

    public ImovelEnderecoController(IImovelEnderecoService ImovelEnderecoService)
    {
        this.imovelEnderecoService = ImovelEnderecoService;
    }
 
    // GET
    [HttpGet("/api/[controller]")]
    [Produces("application/json")]
   public async Task<IActionResult> GetAll() =>
        Ok(await imovelEnderecoService.GetAll());

    // GET
    [HttpGet("/api/[controller]/{codigo}/id/")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarImovelEndereco([FromRoute] int codigo) =>
        Ok(await imovelEnderecoService.GetById(codigo));


    // GET
    [HttpGet("/api/[controller]/{codigo}/idImovel/")]
    [Produces("application/json")]
    public async Task<IActionResult> BuscarEnderecoPorImovel([FromRoute] int codigo) =>
        Ok(await imovelEnderecoService.BuscarEnderecoPorImovel(codigo));


    [HttpPost("/api/[controller]/criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarImovelEnderecoCommand cmd)
    {
        var result = await imovelEnderecoService.Insert(cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("/api/[controller]/{codigo}/atualizar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(int? codigo, [FromBody] CriarImovelEnderecoCommand cmd)
    {
        var result = await imovelEnderecoService.Update(codigo, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpDelete("/api/[controller]/{codigo}/deletar/")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await imovelEnderecoService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
}

