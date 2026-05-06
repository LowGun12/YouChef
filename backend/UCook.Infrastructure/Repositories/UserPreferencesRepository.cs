using Microsoft.EntityFrameworkCore;
using UCook.Application.Interfaces;
using UCook.Domain.Entities;
using UCook.Infrastructure.Data;

namespace UCook.Infrastructure.Repositories;

public class UserPreferencesRepository(AppDbContext db) : IUserPreferencesRepository
{
    public Task<UserPreferences?> GetByUserIdAsync(Guid userId) =>
        db.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);

    public async Task<UserPreferences> UpsertAsync(UserPreferences prefs)
    {
        var existing = await db.UserPreferences.FirstOrDefaultAsync(p => p.UserId == prefs.UserId);

        if (existing is null)
        {
            db.UserPreferences.Add(prefs);
        }
        else
        {
            existing.AllergiesJson = prefs.AllergiesJson;
            existing.DietaryJson = prefs.DietaryJson;
            existing.CuisinePrefsJson = prefs.CuisinePrefsJson;
            existing.OnboardingComplete = prefs.OnboardingComplete;
        }

        await db.SaveChangesAsync();
        return existing ?? prefs;
    }
}
