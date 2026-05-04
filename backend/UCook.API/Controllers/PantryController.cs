using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UCook.Application.DTOs;
using UCook.Application.Interfaces;

namespace UCook.API.Controllers;

[ApiController]
[Route("api/pantry")]
[Authorize]
public class PantryController(IPantryService pantryService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<PantryItemDto>>> GetItems() =>
        Ok(await pantryService.GetItemsAsync(UserId));

    [HttpPost]
    public async Task<ActionResult<PantryItemDto>> AddItem(AddPantryItemRequest req) =>
        Ok(await pantryService.AddItemAsync(UserId, req));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> RemoveItem(Guid id)
    {
        try
        {
            await pantryService.RemoveItemAsync(UserId, id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("barcode/{code}")]
    public async Task<IActionResult> LookupBarcode(string code)
    {
        var result = await pantryService.LookupBarcodeAsync(code);
        return result is null
            ? NotFound(new { message = "Unknown barcode." })
            : Ok(new { name = result.Value.Name, category = result.Value.Category });
    }
}
