using Microsoft.EntityFrameworkCore;
using UCook.Domain.Entities;

namespace UCook.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Recipes.AnyAsync()) return;

        var recipes = new[]
        {
            CreateRecipe(
                "Spaghetti Aglio e Olio",
                "A classic Neapolitan pasta with garlic, olive oil, and chili.",
                "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop",
                5, 15, 2, "easy", "Italian",
                ["pasta", "vegetarian", "quick"],
                allergens: ["wheat"],
                dietary: ["vegetarian"],
                [("Pasta", 200, "g", false), ("Garlic", 4, "cloves", false), ("Olive Oil", 60, "ml", false), ("Red Chili Flakes", 1, "tsp", true), ("Parsley", 2, "tbsp", true)],
                [
                    (1, "Bring salted water to boil. Cook pasta al dente.", 10),
                    (2, "Thinly slice garlic and gently fry in olive oil until golden.", 5),
                    (3, "Add chili, toss in pasta with pasta water.", 2),
                    (4, "Finish with parsley and serve immediately.", null),
                ]
            ),
            CreateRecipe(
                "Chicken Tomato Stir-fry",
                "Quick and healthy chicken stir-fry with fresh tomatoes.",
                "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop",
                10, 15, 2, "easy", "Asian",
                ["chicken", "quick", "healthy"],
                allergens: ["soy"],
                dietary: [],
                [("Chicken Breast", 300, "g", false), ("Tomatoes", 3, "pcs", false), ("Onion", 1, "pc", false), ("Garlic", 3, "cloves", false), ("Soy Sauce", 2, "tbsp", false)],
                [
                    (1, "Slice chicken into strips. Season.", null),
                    (2, "Stir-fry chicken in hot oil until cooked.", 6),
                    (3, "Add garlic and onion, fry 2 minutes.", 2),
                    (4, "Add tomatoes and soy sauce, cook until soft.", 4),
                    (5, "Serve over rice.", null),
                ]
            ),
            CreateRecipe(
                "Cheesy Scrambled Eggs",
                "Silky scrambled eggs with melted cheddar.",
                "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop",
                2, 8, 1, "easy", "American",
                ["breakfast", "eggs", "quick"],
                allergens: ["eggs", "milk"],
                dietary: ["vegetarian"],
                [("Eggs", 3, "pcs", false), ("Cheddar Cheese", 40, "g", false), ("Butter", 1, "tbsp", false), ("Chives", 1, "tbsp", true)],
                [
                    (1, "Whisk eggs with a pinch of salt.", null),
                    (2, "Melt butter in non-stick pan on low heat. Add eggs.", 1),
                    (3, "Fold gently, removing from heat to keep soft.", 4),
                    (4, "Fold in cheese just before set. Serve.", null),
                ]
            ),
        };

        await db.Recipes.AddRangeAsync(recipes);
        await db.SaveChangesAsync();
    }

    private static Recipe CreateRecipe(
        string title, string desc, string? imageUrl,
        int prep, int cook, int servings, string difficulty, string cuisine,
        string[] tags,
        string[] allergens,
        string[] dietary,
        (string name, double qty, string unit, bool optional)[] ingredients,
        (int order, string desc, int? duration)[] steps)
    {
        var recipe = new Recipe
        {
            Title = title,
            Description = desc,
            ImageUrl = imageUrl,
            PrepTime = prep,
            CookTime = cook,
            Servings = servings,
            Difficulty = difficulty,
            Cuisine = cuisine,
            TagsJson = System.Text.Json.JsonSerializer.Serialize(tags),
            AllergensJson = System.Text.Json.JsonSerializer.Serialize(allergens),
            DietaryJson = System.Text.Json.JsonSerializer.Serialize(dietary),
        };

        foreach (var (name, qty, unit, optional) in ingredients)
            recipe.Ingredients.Add(new RecipeIngredient { Name = name, Quantity = qty, Unit = unit, Optional = optional, RecipeId = recipe.Id });

        foreach (var (order, d, duration) in steps)
            recipe.Steps.Add(new RecipeStep { Order = order, Description = d, Duration = duration, RecipeId = recipe.Id });

        return recipe;
    }
}
