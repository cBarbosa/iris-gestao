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
        services.AddScoped<IAnexoService, AnexoService>();

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
        services.AddScoped<IAnexoRepository, Repository.Impl.AnexoRepository>();
    }
}