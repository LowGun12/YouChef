using UCook.Application.DTOs;
using UCook.Application.Interfaces;
using UCook.Domain.Entities;

namespace UCook.Infrastructure.Services;

public class PantryService(IPantryRepository pantry) : IPantryService
{
    private static readonly Dictionary<string, (string Name, string Category)> BarcodeDb = new()
    {
        ["5000112637922"] = ("Heinz Baked Beans", "other"),
        ["5000143021008"] = ("Lurpak Butter", "dairy"),
        ["3017620422003"] = ("Nutella", "condiments"),
        ["DEMO001"] = ("Cherry Tomatoes", "produce"),
        ["DEMO002"] = ("Whole Milk", "dairy"),
        ["DEMO003"] = ("Free Range Eggs", "dairy"),
        ["DEMO004"] = ("Sourdough Bread", "grains"),
    };

    public async Task<List<PantryItemDto>> GetItemsAsync(Guid userId)
    {
        var items = await pantry.GetByUserIdAsync(userId);
        return items.Select(ToDto).ToList();
    }

    public async Task<PantryItemDto> AddItemAsync(Guid userId, AddPantryItemRequest req)
    {
        var item = new PantryItem
        {
            UserId = userId,
            Name = req.Name,
            Category = req.Category,
            Quantity = req.Quantity,
            Unit = req.Unit,
            Barcode = req.Barcode,
            ExpiresAt = req.ExpiresAt,
        };

        await pantry.AddAsync(item);
        return ToDto(item);
    }

    public async Task RemoveItemAsync(Guid userId, Guid itemId)
    {
        var item = await pantry.FindAsync(itemId, userId)
            ?? throw new KeyNotFoundException("Item not found.");

        await pantry.RemoveAsync(item);
    }

    public Task<(string Name, string Category)?> LookupBarcodeAsync(string code)
    {
        BarcodeDb.TryGetValue(code, out var result);
        return Task.FromResult<(string, string)?>(result == default ? null : result);
    }

    private static PantryItemDto ToDto(PantryItem p) =>
        new(p.Id, p.UserId, p.Name, p.Category, p.Quantity, p.Unit, p.Barcode, p.ExpiresAt, p.AddedAt);
}
