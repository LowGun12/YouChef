using UCook.Application.DTOs;

namespace UCook.Application.Interfaces;

public interface IRecipeService
{
    Task<RecipeListResponse> GetAllAsync(string? search, string? cuisine, string? difficulty, int page, int pageSize);
    Task<RecipeDto?> GetByIdAsync(Guid id);
    Task<List<RecipeMatchDto>> GetMatchesAsync(Guid userId);
    Task<List<RecipeDto>> GetSavedAsync(Guid userId);
    Task SaveRecipeAsync(Guid userId, Guid recipeId);
    Task UnsaveRecipeAsync(Guid userId, Guid recipeId);
    Task<RecipeDto> CreateAsync(CreateRecipeRequest req);
}
