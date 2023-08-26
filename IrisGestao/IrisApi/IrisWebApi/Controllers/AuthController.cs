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
            User.Claims.FirstOrDefault(x => x.Type.Equals("name"))!.Value ?? "Anonymous",
            User.Claims.FirstOrDefault(x => x.Type.Equals("jobTitle"))!.Value.ToUpper(),
            int.Parse(User.Claims.FirstOrDefault(x => x.Type.Equals("exp"))!.Value)
        );
        
        if (!result.Success)
        {
            return await Task.FromResult(Unauthorized(result.Message));
        }

        return await Task.FromResult(Ok(result));
    }
    
    [Produces("application/json")]
    [HttpPost("validate")]
    public async Task<IActionResult> Post([FromBody] string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return await Task.FromResult(Unauthorized("parâmetros inválidos"));
        }
        
        var result = await Service.GetAuthData(User.Claims.FirstOrDefault(x => x.Type.Equals("emails"))!.Value,
            User.Claims.FirstOrDefault(x => x.Type.Equals("name"))!.Value ?? "Anonymous",
            User.Claims.FirstOrDefault(x => x.Type.Equals("jobTitle"))!.Value.ToUpper(),
            int.Parse(User.Claims.FirstOrDefault(x => x.Type.Equals("exp"))!.Value)
        );
        
        if (!result.Success)
        {
            return await Task.FromResult(Unauthorized(result.Message));
        }

        return await Task.FromResult(Ok(result));
    }
}
