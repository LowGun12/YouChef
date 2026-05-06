using System.Text.Json;
using UCook.Application.DTOs;
using UCook.Application.Interfaces;
using UCook.Domain.Entities;

namespace UCook.Infrastructure.Services;

public class RecipeService(
    IRecipeRepository recipes,
    IPantryRepository pantry,
    IUserPreferencesRepository preferences) : IRecipeService
{
    public async Task<RecipeListResponse> GetAllAsync(string? search, string? cuisine, string? difficulty, int page, int pageSize)
    {
        var (items, total) = await recipes.GetAllAsync(search, cuisine, difficulty, page, pageSize);
        return new RecipeListResponse(items.Select(ToDto).ToList(), total, page, pageSize);
    }

    public async Task<RecipeDto?> GetByIdAsync(Guid id)
    {
        var recipe = await recipes.GetByIdAsync(id);
        return recipe is null ? null : ToDto(recipe);
    }

    public async Task<List<RecipeMatchDto>> GetMatchesAsync(Guid userId)
    {
        var pantryNames = await pantry.GetItemNamesAsync(userId);
        var allRecipes = await recipes.GetAllWithIngredientsAsync();

        // Apply allergen filtering based on user preferences
        var userPrefs = await preferences.GetByUserIdAsync(userId);
        var userAllergens = userPrefs is null
            ? new List<string>()
            : Deserialize(userPrefs.AllergiesJson);

        var filtered = allRecipes.Where(r =>
        {
            if (userAllergens.Count == 0) return true;
            var recipeAllergens = Deserialize(r.AllergensJson);
            return !recipeAllergens.Any(a => userAllergens.Contains(a, StringComparer.OrdinalIgnoreCase));
        });

        return filtered.Select(r => BuildMatch(r, pantryNames)).ToList();
    }

    public async Task<List<RecipeDto>> GetSavedAsync(Guid userId)
    {
        var saved = await recipes.GetSavedAsync(userId);
        return saved.Select(ToDto).ToList();
    }

    public Task SaveRecipeAsync(Guid userId, Guid recipeId) =>
        recipes.SaveAsync(userId, recipeId);

    public Task UnsaveRecipeAsync(Guid userId, Guid recipeId) =>
        recipes.UnsaveAsync(userId, recipeId);

    public async Task<RecipeDto> CreateAsync(CreateRecipeRequest req)
    {
        var recipe = new Recipe
        {
            Title = req.Title,
            Description = req.Description,
            ImageUrl = string.IsNullOrWhiteSpace(req.ImageUrl) ? null : req.ImageUrl,
            PrepTime = req.PrepTime,
            CookTime = req.CookTime,
            Servings = req.Servings,
            Difficulty = req.Difficulty,
            Cuisine = req.Cuisine,
            TagsJson = JsonSerializer.Serialize(req.Tags),
            AllergensJson = JsonSerializer.Serialize(req.Allergens ?? []),
            DietaryJson = JsonSerializer.Serialize(req.Dietary ?? []),
        };

        for (int i = 0; i < req.Ingredients.Count; i++)
        {
            var ing = req.Ingredients[i];
            recipe.Ingredients.Add(new RecipeIngredient
            {
                Name = ing.Name,
                Quantity = ing.Quantity,
                Unit = ing.Unit,
                Optional = ing.Optional,
                RecipeId = recipe.Id,
            });
        }

        for (int i = 0; i < req.Steps.Count; i++)
        {
            var step = req.Steps[i];
            recipe.Steps.Add(new RecipeStep
            {
                Order = i + 1,
                Description = step.Description,
                Duration = step.Duration,
                RecipeId = recipe.Id,
            });
        }

        await recipes.CreateAsync(recipe);
        return ToDto(recipe);
    }

    private static RecipeMatchDto BuildMatch(Recipe recipe, List<string> pantryNames)
    {
        var required = recipe.Ingredients.Where(i => !i.Optional).ToList();
        var have = required.Where(i => pantryNames.Any(p =>
            p.Contains(i.Name.ToLower()) || i.Name.ToLower().Contains(p))).ToList();
        var missing = required.Except(have).ToList();

        int matchPct = required.Count > 0 ? (int)Math.Round((double)have.Count / required.Count * 100) : 100;

        return new RecipeMatchDto(
            ToDto(recipe),
            missing.Count == 0,
            matchPct,
            have.Count,
            missing.Count,
            missing.Select(i => i.Name).ToList(),
            have.Select(i => i.Name).ToList()
        );
    }

    private static RecipeDto ToDto(Recipe r) => new(
        r.Id, r.Title, r.Description, r.ImageUrl,
        r.PrepTime, r.CookTime, r.Servings, r.Difficulty, r.Cuisine,
        Deserialize(r.TagsJson),
        Deserialize(r.AllergensJson),
        Deserialize(r.DietaryJson),
        r.Ingredients.Select(i => new RecipeIngredientDto(i.Id, i.Name, i.Quantity, i.Unit, i.Optional)).ToList(),
        r.Steps.OrderBy(s => s.Order).Select(s => new RecipeStepDto(s.Order, s.Description, s.Duration)).ToList(),
        r.CreatedAt
    );

    private static List<string> Deserialize(string json)
    {
        try { return JsonSerializer.Deserialize<List<string>>(json) ?? []; }
        catch { return []; }
    }
}
