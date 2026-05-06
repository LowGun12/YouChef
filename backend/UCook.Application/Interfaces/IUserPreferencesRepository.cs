using UCook.Domain.Entities;

namespace UCook.Application.Interfaces;

public interface IUserPreferencesRepository
{
    Task<UserPreferences?> GetByUserIdAsync(Guid userId);
    Task<UserPreferences> UpsertAsync(UserPreferences prefs);
}
