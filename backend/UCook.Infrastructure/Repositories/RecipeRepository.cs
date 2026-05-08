using Microsoft.EntityFrameworkCore;
using UCook.Application.Interfaces;
using UCook.Domain.Entities;
using UCook.Infrastructure.Data;

namespace UCook.Infrastructure.Repositories;

public class RecipeRepository(AppDbContext db) : IRecipeRepository
{
    public async Task<(List<Recipe> Items, int Total)> GetAllAsync(
        string? search, string? cuisine, string? difficulty, int page, int pageSize)
    {
        var query = db.Recipes
            .AsNoTracking()
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(r => r.Title.Contains(search));
        if (!string.IsNullOrWhiteSpace(cuisine))
            query = query.Where(r => r.Cuisine == cuisine);
        if (!string.IsNullOrWhiteSpace(difficulty))
            query = query.Where(r => r.Difficulty == difficulty);

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(r => r.Title)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public Task<Recipe?> GetByIdAsync(Guid id) =>
        db.Recipes
            .AsNoTracking()
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .FirstOrDefaultAsync(r => r.Id == id);

    public Task<List<Recipe>> GetAllWithIngredientsAsync() =>
        db.Recipes
            .AsNoTracking()
            .Include(r => r.Ingredients)
            .Include(r => r.Steps)
            .ToListAsync();

    public Task<List<Recipe>> GetSavedAsync(Guid userId) =>
        db.SavedRecipes
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .Include(s => s.Recipe).ThenInclude(r => r.Ingredients)
            .Include(s => s.Recipe).ThenInclude(r => r.Steps)
            .Select(s => s.Recipe)
            .ToListAsync();

    public Task<bool> IsSavedAsync(Guid userId, Guid recipeId) =>
        db.SavedRecipes.AnyAsync(s => s.UserId == userId && s.RecipeId == recipeId);

    public async Task SaveAsync(Guid userId, Guid recipeId)
    {
        if (!await IsSavedAsync(userId, recipeId))
        {
            db.SavedRecipes.Add(new SavedRecipe { UserId = userId, RecipeId = recipeId });
            await db.SaveChangesAsync();
        }
    }

    public async Task UnsaveAsync(Guid userId, Guid recipeId)
    {
        var saved = await db.SavedRecipes
            .FirstOrDefaultAsync(s => s.UserId == userId && s.RecipeId == recipeId);
        if (saved is not null)
        {
            db.SavedRecipes.Remove(saved);
            await db.SaveChangesAsync();
        }
    }

    public async Task<Recipe> CreateAsync(Recipe recipe)
    {
        db.Recipes.Add(recipe);
        await db.SaveChangesAsync();
        return recipe;
    }
}
