using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DominiosController : Controller
{
    private readonly ICategoriaImovelService categoriaImovelService;
    private readonly IIndiceReajusteService indiceReajusteService;
    private readonly IFormaPagamentoService formaPagamentoService;
    private readonly ITipoUnidadeService tipoUnidadeService;
    private readonly ITipoContratoService tipoContratoService;
    private readonly ITipoTituloService tipoTituloService;
    private readonly ITipoDespesaService tipoDespesaService;

    public DominiosController(ICategoriaImovelService categoriaImovelService,
                              IIndiceReajusteService indiceReajusteService,
                              IFormaPagamentoService formaPagamentoService,
                              ITipoUnidadeService tipoUnidadeService,
                              ITipoContratoService tipoContratoService,
                              ITipoTituloService tipoTituloService,
                              ITipoDespesaService tipoDespesaService)
    {
        this.categoriaImovelService = categoriaImovelService;
        this.indiceReajusteService = indiceReajusteService;
        this.formaPagamentoService = formaPagamentoService;
        this.tipoUnidadeService = tipoUnidadeService;
        this.tipoContratoService = tipoContratoService;
        this.tipoTituloService = tipoTituloService;
        this.tipoDespesaService = tipoDespesaService;
    }

    // GET
    [HttpGet("/api/[controller]/GetCategoriaImoveis")]
    [Produces("application/json")]
    public async Task<IActionResult> GetCategoriaImoveis() =>
        Ok(await categoriaImovelService.GetAll());

    // GET
    [HttpGet("/api/[controller]/GetIndiceReajuste")]
    [Produces("application/json")]
    public async Task<IActionResult> GetIndiceReajuste() =>
        Ok(await indiceReajusteService.GetAll());

    // GET
    [HttpGet("/api/[controller]/GetFormaPagamento")]
    [Produces("application/json")]
    public async Task<IActionResult> GetFormaPagamento() =>
        Ok(await formaPagamentoService.GetAll());

    // GET
    [HttpGet("/api/[controller]/GetTipoUnidade")]
    [Produces("application/json")]
    public async Task<IActionResult> GetTipoUnidade() =>
        Ok(await tipoUnidadeService.GetAll());

    // GET
    [HttpGet("/api/[controller]/GetTipoContrato")]
    [Produces("application/json")]
    public async Task<IActionResult> GetTipoContrato() =>
        Ok(await tipoContratoService.GetAll());

    // GET
    [HttpGet("/api/[controller]/GetTipoTitulo")]
    [Produces("application/json")]
    public async Task<IActionResult> GetTipoTitulo() =>
        Ok(await tipoTituloService.GetAll());

    // GET
    [HttpGet("/api/[controller]/GetTipoDespesa")]
    [Produces("application/json")]
    public async Task<IActionResult> GetTipoDespesa() =>
        Ok(await tipoDespesaService.GetAll());
}