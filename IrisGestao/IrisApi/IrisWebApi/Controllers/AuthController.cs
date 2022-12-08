using IrisGestao.ApplicationService.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AuthController : Controller
{
    private readonly IAuthService Service;

    public AuthController(IAuthService Service)
    {
        this.Service = Service;
    }
    
    [Produces("application/json")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var result = await Service.GetAuthData(User.Claims.FirstOrDefault(x => x.Type.Equals("emails"))!.Value,
            User.Claims.FirstOrDefault(x => x.Type.Equals("name"))!.Value,
            User.Claims.FirstOrDefault(x => x.Type.Equals("jobTitle"))!.Value,
            int.Parse(User.Claims.FirstOrDefault(x => x.Type.Equals("exp"))!.Value)
        );

        if (!result.Success)
        {
            return Unauthorized(result.Message);
        }

        return Ok(result);
    }
    
    [Produces("application/json")]
    [HttpPost("validate")]
    public async Task<IActionResult> Post([FromBody] string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return await Task.FromResult(Unauthorized("parâmetros inválidos"));
        }

        return await Task.FromResult(Ok(new
        {
            Email = User.Claims.FirstOrDefault(x => x.Type.Equals("emails"))!.Value,
            Name = User.Claims.FirstOrDefault(x => x.Type.Equals("name"))!.Value,
            JobTitle = User.Claims.FirstOrDefault(x => x.Type.Equals("jobTitle"))!.Value,
            RequestUTCDateTime = DateTime.Now.ToLocalTime(),
            Expiration = User.Claims.FirstOrDefault(x => x.Type.Equals("exp"))!.Value,
            ExpirationUTCDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0)
                .AddSeconds(int.Parse(User.Claims.FirstOrDefault(x => x.Type.Equals("exp"))!.Value)).ToLocalTime()
        }));
    }
}
