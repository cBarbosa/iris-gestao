using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Request;
using Microsoft.AspNetCore.Mvc;
using IrisGestao.Domain.Emuns;

namespace IrisWebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ImovelController : ControllerBase
{
    private readonly IImovelService imovelService;

    public ImovelController(IImovelService imovelService)
    {
        this.imovelService = imovelService;
    }
 
    [HttpGet]
   public async Task<IActionResult> GetAll(
       [FromQuery] int? idCategoria
       , [FromQuery] int? idProprietario
       , [FromQuery] int? idTipoImovel
       , [FromQuery] string? nome
       , [FromQuery] int? limit = 10
       , [FromQuery] int? page = 1)
    {
        idTipoImovel ??= TipoImovelEnum.IMOVEL_CARTEIRA;
        var result = await imovelService.GetAllPaging(idCategoria, idTipoImovel, idProprietario, nome, limit ?? 10, page ?? 1);

        return Ok(result);
    }

    [HttpGet("{guid}/guid/")]
    public async Task<IActionResult> GetByGuid([FromRoute] Guid guid) =>
        Ok(await imovelService.GetByGuid(guid));

    [HttpGet("BuscarImoveisDisponiveis")]
    public async Task<IActionResult> GetImoveisParaContrato()
        => Ok(await imovelService.GetImoveisParaContrato());

    [HttpPost("criar")]
    public async Task<IActionResult> Insert([FromBody] CriarImovelCommand cmd)
        => Ok(await imovelService.Insert(cmd));

    [HttpPut("{guid}/atualizar")]
    public async Task<IActionResult> Update(
        Guid guid,
        [FromBody] CriarImovelCommand cmd)
        => Ok(await imovelService.Update(guid, cmd));
    

    [HttpPut("{guid}/{status}/alterar-status")]
    public async Task<IActionResult> AlterarStatus(
    Guid guid,
    bool status)
        => Ok(await imovelService.AlterarStatus(guid, status));


    [HttpDelete("{codigo}/deletar")]
    public async Task<IActionResult> Deletar(int? codigo)
        => Ok(await imovelService.Delete(codigo));

}