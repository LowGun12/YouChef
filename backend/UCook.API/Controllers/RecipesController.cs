using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UCook.Application.DTOs;
using UCook.Application.Interfaces;

namespace UCook.API.Controllers;

[ApiController]
[Route("api/recipes")]
public class RecipesController(IRecipeService recipeService) : ControllerBase
{
    private Guid? UserId =>
        User.Identity?.IsAuthenticated == true
            ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
            : null;

    [HttpGet]
    public async Task<ActionResult<RecipeListResponse>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? cuisine,
        [FromQuery] string? difficulty,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20) =>
        Ok(await recipeService.GetAllAsync(search, cuisine, difficulty, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var recipe = await recipeService.GetByIdAsync(id);
        return recipe is null ? NotFound() : Ok(recipe);
    }

    [HttpGet("matches")]
    [Authorize]
    public async Task<ActionResult<List<RecipeMatchDto>>> GetMatches() =>
        Ok(await recipeService.GetMatchesAsync(UserId!.Value));

    [HttpGet("saved")]
    [Authorize]
    public async Task<ActionResult<List<RecipeDto>>> GetSaved() =>
        Ok(await recipeService.GetSavedAsync(UserId!.Value));

    [HttpPost("{id:guid}/save")]
    [Authorize]
    public async Task<IActionResult> Save(Guid id)
    {
        await recipeService.SaveRecipeAsync(UserId!.Value, id);
        return Ok();
    }

    [HttpDelete("{id:guid}/save")]
    [Authorize]
    public async Task<IActionResult> Unsave(Guid id)
    {
        await recipeService.UnsaveRecipeAsync(UserId!.Value, id);
        return NoContent();
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<RecipeDto>> Create([FromBody] CreateRecipeRequest req)
    {
        var recipe = await recipeService.CreateAsync(req);
        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
    }
}
