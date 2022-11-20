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

        //Repositories
        services.AddTransient(typeof(IRepository<>), typeof(Repository.Impl.Repository<>));
    }
}