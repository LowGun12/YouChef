using UCook.Application.DTOs;

namespace UCook.Application.Interfaces;

public interface IPantryService
{
    Task<List<PantryItemDto>> GetItemsAsync(Guid userId);
    Task<PantryItemDto> AddItemAsync(Guid userId, AddPantryItemRequest request);
    Task RemoveItemAsync(Guid userId, Guid itemId);
    Task<(string Name, string Category)?> LookupBarcodeAsync(string code);
}
