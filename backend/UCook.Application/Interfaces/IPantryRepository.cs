using UCook.Domain.Entities;

namespace UCook.Application.Interfaces;

public interface IPantryRepository
{
    Task<List<PantryItem>> GetByUserIdAsync(Guid userId);
    Task<PantryItem> AddAsync(PantryItem item);
    Task<PantryItem?> FindAsync(Guid itemId, Guid userId);
    Task RemoveAsync(PantryItem item);
    Task<List<string>> GetItemNamesAsync(Guid userId);
}
