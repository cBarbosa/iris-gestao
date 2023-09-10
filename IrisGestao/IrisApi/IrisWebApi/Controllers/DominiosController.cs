using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
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
    private readonly ITipoEventoService tipoEventoService;
    private readonly ITipoClienteService tipoClienteService;
    private readonly ITipoCreditoAluguelService tipoCreditoAluguelService;
    private readonly IObraService obraService;

    public DominiosController(ICategoriaImovelService categoriaImovelService,
                              IIndiceReajusteService indiceReajusteService,
                              IFormaPagamentoService formaPagamentoService,
                              ITipoUnidadeService tipoUnidadeService,
                              ITipoContratoService tipoContratoService,
                              ITipoTituloService tipoTituloService,
                              ITipoDespesaService tipoDespesaService,
                              ITipoEventoService tipoEventoService,
                              ITipoClienteService tipoClienteService,
                              ITipoCreditoAluguelService tipoCreditoAluguelService,
                              IObraService obraService)
    {
        this.categoriaImovelService = categoriaImovelService;
        this.indiceReajusteService = indiceReajusteService;
        this.formaPagamentoService = formaPagamentoService;
        this.tipoUnidadeService = tipoUnidadeService;
        this.tipoContratoService = tipoContratoService;
        this.tipoTituloService = tipoTituloService;
        this.tipoDespesaService = tipoDespesaService;
        this.tipoEventoService = tipoEventoService;
        this.tipoClienteService = tipoClienteService;
        this.tipoCreditoAluguelService = tipoCreditoAluguelService;
        this.obraService = obraService;
    }

    [HttpGet("categoria-imovel")]
    public async Task<IActionResult> GetCategoriaImoveis() =>
        Ok(await categoriaImovelService.GetAll());

    [HttpGet("indice-reajuste")]
    public async Task<IActionResult> GetIndiceReajuste() =>
        Ok(await indiceReajusteService.GetAll());

    [HttpGet("forma-pagamento")]
    public async Task<IActionResult> GetFormaPagamento() =>
        Ok(await formaPagamentoService.GetAll());

    [HttpGet("tipo-unidade")]
    public async Task<IActionResult> GetTipoUnidade() =>
        Ok(await tipoUnidadeService.GetAll());

    [HttpGet("tipo-contrato")]
    public async Task<IActionResult> GetTipoContrato() =>
        Ok(await tipoContratoService.GetAll());

    [HttpGet("tipo-titulo")]
    public async Task<IActionResult> GetTipoTitulo() =>
        Ok(await tipoTituloService.GetAll());

    [HttpGet("tipo-despesa")]
    public async Task<IActionResult> GetTipoDespesa() =>
        Ok(await tipoDespesaService.GetAll());

    [HttpGet("tipo-evento")]
    public async Task<IActionResult> GetTipoEvento() =>
        Ok(await tipoEventoService.GetAll());

    [HttpGet("tipo-cliente")]
    public async Task<IActionResult> GetTipoCliente() =>
        Ok(await tipoClienteService.GetAll());

    [HttpGet("tipo-credito-aluguel")]
    public async Task<IActionResult> GetTipoCreditoAluguel() =>
        Ok(await tipoCreditoAluguelService.GetAll());
    
    [HttpGet("bancos")]
    public async Task<IActionResult> GetBancos() =>
        Ok(await formaPagamentoService.GetBancos());
    
    [HttpGet("tipo-servico-obra")]
    public async Task<IActionResult> GetTiposServicoObra() =>
        Ok(await obraService.GetTiposServicoObra());
}