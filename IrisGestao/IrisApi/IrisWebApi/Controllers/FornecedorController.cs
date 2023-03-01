using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FornecedorController : Controller
{
    private readonly IFornecedorService FornecedorService;

    public FornecedorController(IFornecedorService FornecedorService)
    {
        this.FornecedorService = FornecedorService;
    }
 
   [HttpGet]
   [Produces("application/json")]
   public async Task<IActionResult> GetAllPaging(
       [FromQuery] string? nome
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1) =>  
        Ok(await FornecedorService.GetAllPaging(nome, limit ?? 10, page ?? 1));

    [HttpGet("{guid}/guid/")]
    [Produces("application/json")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await FornecedorService.GetByGuid(guid));

    [HttpPost("criar")]
    [Produces("application/json")]
    public async Task<IActionResult> Cadatrar([FromBody] CriarFornecedorCommand cmd) =>
        Ok(await FornecedorService.Insert(cmd));

    [HttpPut("{guid}/atualizar")]
    [Produces("application/json")]
    public async Task<IActionResult> Atualizar(
        Guid guid,
        [FromBody] CriarFornecedorCommand cmd)
    {
        var result = await FornecedorService.Update(guid, cmd);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }

    [HttpPut("{guid}/{status}/alterar-status")]
    [Produces("application/json")]
    public async Task<IActionResult> AlterarStatus(
    Guid guid,
    bool status)
    {
        var result = await FornecedorService.AlterarStatus(guid, status);

        return Ok(result);
    }

    [HttpDelete("{codigo}/deletar")]
    [Produces("application/json")]
    public async Task<IActionResult> Deletar(int? codigo)
    {
        var result = await FornecedorService.Delete(codigo);

        if (result == null)
            return BadRequest("Operação não realizada");

        return Ok(result);
    }
}

