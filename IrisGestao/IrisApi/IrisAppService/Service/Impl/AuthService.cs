using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;

namespace IrisGestao.ApplicationService.Service.Impl;

public class AuthService: IAuthService
{
    private readonly IClienteService clienteService;
    private readonly ILogger<AuthService> Logger;

    public AuthService(
        IClienteService clienteService,
        ILogger<AuthService> Logger)
    {
        this.clienteService = clienteService;
        this.Logger = Logger;
    }
    
    public async Task<CommandResult> GetAuthData(string email, string name, string jobTitle, int expirationTS)
    {
        var _uuid = Guid.NewGuid();
        var _id = new Random().Next(1, 999);
        
        if (jobTitle.ToLower().Equals("cliente"))
        {
            var cpfCnpj = name.Split("-")[0];
            var cliente = await clienteService.GetByCpfCnpj(cpfCnpj);

            if (!cliente.Success)
            {
                return await Task.FromResult(
                    new CommandResult(false, "Não foi possível localizar o cliente", null));
            }

            var clienteData = (Cliente)cliente.Data;
            name = clienteData.Nome;
            _uuid = clienteData.GuidReferencia.Value;
            _id = clienteData.Id;
        }
        
        return await Task.FromResult(new CommandResult(true, "Dados validados com sucesso",
            new
            {
                Id = _id,
                Uuid = _uuid,
                Email = email,
                Name = name,
                Perfil = jobTitle,
                RequestUTCDateTime = DateTime.Now.ToLocalTime(),
                Expiration = expirationTS,
                ExpirationUTCDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0)
                    .AddSeconds(expirationTS).ToLocalTime()
            }));
    }

}