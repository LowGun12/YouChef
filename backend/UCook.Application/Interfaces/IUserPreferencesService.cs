using UCook.Application.DTOs;

namespace UCook.Application.Interfaces;

public interface IUserPreferencesService
{
    Task<UserPreferencesDto> GetAsync(Guid userId);
    Task<UserPreferencesDto> SaveAsync(Guid userId, SavePreferencesRequest req);
}
