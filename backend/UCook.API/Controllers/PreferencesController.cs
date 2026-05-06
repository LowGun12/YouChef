using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UCook.Application.DTOs;
using UCook.Application.Interfaces;

namespace UCook.API.Controllers;

[ApiController]
[Route("api/preferences")]
[Authorize]
public class PreferencesController(IUserPreferencesService preferencesService) : ControllerBase
{
    private Guid UserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<UserPreferencesDto>> Get() =>
        Ok(await preferencesService.GetAsync(UserId));

    [HttpPost]
    public async Task<ActionResult<UserPreferencesDto>> Save([FromBody] SavePreferencesRequest req) =>
        Ok(await preferencesService.SaveAsync(UserId, req));
}
