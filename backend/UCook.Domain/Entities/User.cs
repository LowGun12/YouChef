namespace UCook.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PantryItem> PantryItems { get; set; } = new List<PantryItem>();
    public ICollection<SavedRecipe> SavedRecipes { get; set; } = new List<SavedRecipe>();
}
