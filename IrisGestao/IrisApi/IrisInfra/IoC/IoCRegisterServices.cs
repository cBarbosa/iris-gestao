using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Service.Impl;
using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.Extensions.DependencyInjection;

namespace IrisGestao.Infraestructure.IoC;

public class IoCRegisterServices
{
    public static void Register(IServiceCollection services)
    {
        //Services            
        services.AddScoped<IContatoService, ContatoService>();
        services.AddScoped<ICategoriaImovelService, CategoriaImovelService>();
        services.AddScoped<IIndiceReajusteService, IndiceReajusteService>();
        services.AddScoped<IFormaPagamentoService, FormaPagamentoService>();
        services.AddScoped<ITipoUnidadeService, TipoUnidadeService>();
        services.AddScoped<ITipoContratoService, TipoContratoService>();
        services.AddScoped<ITipoTituloService, TipoTituloService>();
        services.AddScoped<ITipoDespesaService, TipoDespesaService>();
        services.AddScoped<ITipoEventoService, TipoEventoService>();
        services.AddScoped<IAnexoService, AnexoService>();
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IImovelService, ImovelService>();
        services.AddScoped<IUnidadeService, UnidadeService>();
        services.AddScoped<IImovelEnderecoService, ImovelEnderecoService>();
        services.AddScoped<IEventoService, EventoService>();

        //Repositories
        services.AddTransient(typeof(IRepository<>), typeof(Repository.Impl.Repository<>));
        services.AddScoped<IContatoRepository, Repository.Impl.ContatoRepository>();
        services.AddScoped<ICategoriaImovelRepository, Repository.Impl.CategoriaImovelRepository>();
        services.AddScoped<IIndiceReajusteRepository, Repository.Impl.IndiceReajusteRepository>();
        services.AddScoped<IFormaPagamentoRepository, Repository.Impl.FormaPagamentoRepository>();
        services.AddScoped<ITipoUnidadeRepository, Repository.Impl.TipoUnidadeRepository>();
        services.AddScoped<ITipoContratoRepository, Repository.Impl.TipoContratoRepository>();
        services.AddScoped<ITipoTituloRepository, Repository.Impl.TipoTituloRepository>();
        services.AddScoped<ITipoDespesaRepository, Repository.Impl.TipoDespesaRepository>();
        services.AddScoped<ITipoEventoRepository, Repository.Impl.TipoEventoRepository>();
        services.AddScoped<IAnexoRepository, Repository.Impl.AnexoRepository>();
        services.AddScoped<IClienteRepository, Repository.Impl.ClienteRepository>();
        services.AddScoped<IImovelRepository, Repository.Impl.ImovelRepository>();
        services.AddScoped<IUnidadeRepository, Repository.Impl.UnidadeRepository>();
        services.AddScoped<IImovelEnderecoRepository, Repository.Impl.ImovelEnderecoRepository>();
        services.AddScoped<IEventoRepository, Repository.Impl.EventoRepository>();
    }
}