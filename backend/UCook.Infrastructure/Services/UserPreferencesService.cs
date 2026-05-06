using System.Text.Json;
using UCook.Application.DTOs;
using UCook.Application.Interfaces;
using UCook.Domain.Entities;

namespace UCook.Infrastructure.Services;

public class UserPreferencesService(IUserPreferencesRepository repo) : IUserPreferencesService
{
    public async Task<UserPreferencesDto> GetAsync(Guid userId)
    {
        var prefs = await repo.GetByUserIdAsync(userId);
        return prefs is null ? Empty() : ToDto(prefs);
    }

    public async Task<UserPreferencesDto> SaveAsync(Guid userId, SavePreferencesRequest req)
    {
        var entity = new UserPreferences
        {
            UserId = userId,
            AllergiesJson = JsonSerializer.Serialize(req.Allergies ?? []),
            DietaryJson = JsonSerializer.Serialize(req.Dietary ?? []),
            CuisinePrefsJson = JsonSerializer.Serialize(req.CuisinePrefs ?? []),
            OnboardingComplete = true,
        };

        var saved = await repo.UpsertAsync(entity);
        return ToDto(saved);
    }

    private static UserPreferencesDto ToDto(UserPreferences p) => new(
        Deserialize(p.AllergiesJson),
        Deserialize(p.DietaryJson),
        Deserialize(p.CuisinePrefsJson),
        p.OnboardingComplete
    );

    private static UserPreferencesDto Empty() => new([], [], [], false);

    private static List<string> Deserialize(string json)
    {
        try { return JsonSerializer.Deserialize<List<string>>(json) ?? []; }
        catch { return []; }
    }
}
