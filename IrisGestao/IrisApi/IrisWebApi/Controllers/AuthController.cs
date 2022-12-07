using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IrisWebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AuthController : Controller
{
    [Produces("application/json")]
    [HttpGet]
    public async Task<IActionResult> Index()
    {
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