using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[ApiController]
public class UnidadeController : ControllerBase
{
    private readonly IUnidadeService unidadeService;

    public UnidadeController(IUnidadeService unidadeService)
    {
        this.unidadeService = unidadeService;
    }
 
    [HttpGet]
   public async Task<IActionResult> GetAll() =>
        Ok(await unidadeService.GetAll());

    [HttpGet("{guid}/guid")]
    public async Task<IActionResult> GetByUid([FromRoute] Guid guid) =>
        Ok(await unidadeService.GetByUid(guid));

    [HttpGet("{codigo}/idImovel")]
    public async Task<IActionResult> BuscarBuscarUnidadePorImovel([FromRoute] int codigo) =>
        Ok(await unidadeService.BuscarBuscarUnidadePorImovel(codigo));

    [HttpPost("{guid}/criar")]
    public async Task<IActionResult> Insert(Guid guid, [FromBody] CriarUnidadeCommand cmd) =>
        Ok(await unidadeService.Insert(guid, cmd));

    [HttpPut("{guid}/atualizar")]
    public async Task<IActionResult> Atualizar(
        Guid guid,
        [FromBody] CriarUnidadeCommand cmd) =>
        Ok(await unidadeService.Update(guid, cmd));

    [HttpPut("{guid}/{status}/alterar-status")]
    public async Task<IActionResult> AlterarStatus(Guid guid, bool status) =>
        Ok(await unidadeService.AlterarStatus(guid, status));

    [HttpDelete("{codigo}/deletar")]
    public async Task<IActionResult> Deletar(int? codigo) =>
        Ok(await unidadeService.Delete(codigo));
    
    [HttpPut("{guid}/duplicar")]
    public async Task<IActionResult> Clone(Guid guid) =>
        Ok(await unidadeService.Clone(guid));
}