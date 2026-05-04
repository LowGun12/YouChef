namespace UCook.Domain.Entities;

public class Recipe
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int PrepTime { get; set; }
    public int CookTime { get; set; }
    public int Servings { get; set; }
    public string Difficulty { get; set; } = "easy";
    public string Cuisine { get; set; } = string.Empty;
    public string TagsJson { get; set; } = "[]";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RecipeIngredient> Ingredients { get; set; } = new List<RecipeIngredient>();
    public ICollection<RecipeStep> Steps { get; set; } = new List<RecipeStep>();
    public ICollection<SavedRecipe> SavedByUsers { get; set; } = new List<SavedRecipe>();
}

public class RecipeIngredient
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RecipeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public bool Optional { get; set; }
    public Recipe Recipe { get; set; } = null!;
}

public class RecipeStep
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RecipeId { get; set; }
    public int Order { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? Duration { get; set; }
    public Recipe Recipe { get; set; } = null!;
}

public class SavedRecipe
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid RecipeId { get; set; }
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public Recipe Recipe { get; set; } = null!;
}
