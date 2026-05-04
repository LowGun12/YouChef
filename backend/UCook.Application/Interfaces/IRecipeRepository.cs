using UCook.Domain.Entities;

namespace UCook.Application.Interfaces;

public interface IRecipeRepository
{
    Task<(List<Recipe> Items, int Total)> GetAllAsync(string? search, string? cuisine, string? difficulty, int page, int pageSize);
    Task<Recipe?> GetByIdAsync(Guid id);
    Task<List<Recipe>> GetAllWithIngredientsAsync();
    Task<List<Recipe>> GetSavedAsync(Guid userId);
    Task<bool> IsSavedAsync(Guid userId, Guid recipeId);
    Task SaveAsync(Guid userId, Guid recipeId);
    Task UnsaveAsync(Guid userId, Guid recipeId);
}
