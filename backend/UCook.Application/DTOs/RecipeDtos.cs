namespace UCook.Application.DTOs;

public record RecipeDto(
    Guid Id,
    string Title,
    string Description,
    string? ImageUrl,
    int PrepTime,
    int CookTime,
    int Servings,
    string Difficulty,
    string Cuisine,
    List<string> Tags,
    List<RecipeIngredientDto> Ingredients,
    List<RecipeStepDto> Instructions,
    DateTime CreatedAt
);

public record RecipeIngredientDto(
    Guid Id,
    string Name,
    double Quantity,
    string Unit,
    bool Optional
);

public record RecipeStepDto(int Order, string Description, int? Duration);

public record RecipeMatchDto(
    RecipeDto Recipe,
    bool CanMake,
    int MatchPercent,
    int HaveCount,
    int MissingCount,
    List<string> MissingIngredients,
    List<string> HaveIngredients
);

public record RecipeListResponse(List<RecipeDto> Items, int TotalCount, int Page, int PageSize);

public record CreateIngredientRequest(string Name, double Quantity, string Unit, bool Optional = false);
public record CreateStepRequest(string Description, int? Duration);
public record CreateRecipeRequest(
    string Title,
    string Description,
    string? ImageUrl,
    int PrepTime,
    int CookTime,
    int Servings,
    string Difficulty,
    string Cuisine,
    List<string> Tags,
    List<CreateIngredientRequest> Ingredients,
    List<CreateStepRequest> Steps
);
