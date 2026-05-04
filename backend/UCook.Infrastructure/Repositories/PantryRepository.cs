using Microsoft.EntityFrameworkCore;
using UCook.Application.Interfaces;
using UCook.Domain.Entities;
using UCook.Infrastructure.Data;

namespace UCook.Infrastructure.Repositories;

public class PantryRepository(AppDbContext db) : IPantryRepository
{
    public Task<List<PantryItem>> GetByUserIdAsync(Guid userId) =>
        db.PantryItems
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.AddedAt)
            .ToListAsync();

    public async Task<PantryItem> AddAsync(PantryItem item)
    {
        db.PantryItems.Add(item);
        await db.SaveChangesAsync();
        return item;
    }

    public Task<PantryItem?> FindAsync(Guid itemId, Guid userId) =>
        db.PantryItems.FirstOrDefaultAsync(p => p.Id == itemId && p.UserId == userId);

    public async Task RemoveAsync(PantryItem item)
    {
        db.PantryItems.Remove(item);
        await db.SaveChangesAsync();
    }

    public Task<List<string>> GetItemNamesAsync(Guid userId) =>
        db.PantryItems
            .Where(p => p.UserId == userId)
            .Select(p => p.Name.ToLower())
            .ToListAsync();
}
