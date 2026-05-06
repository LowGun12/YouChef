using Microsoft.EntityFrameworkCore;
using UCook.Domain.Entities;

namespace UCook.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<PantryItem> PantryItems => Set<PantryItem>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>();
    public DbSet<RecipeStep> RecipeSteps => Set<RecipeStep>();
    public DbSet<SavedRecipe> SavedRecipes => Set<SavedRecipe>();
    public DbSet<UserPreferences> UserPreferences => Set<UserPreferences>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<User>().HasIndex(u => u.Email).IsUnique();

        mb.Entity<PantryItem>()
            .HasOne(p => p.User)
            .WithMany(u => u.PantryItems)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<RecipeIngredient>()
            .HasOne(i => i.Recipe)
            .WithMany(r => r.Ingredients)
            .HasForeignKey(i => i.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<RecipeStep>()
            .HasOne(s => s.Recipe)
            .WithMany(r => r.Steps)
            .HasForeignKey(s => s.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<SavedRecipe>()
            .HasOne(s => s.User)
            .WithMany(u => u.SavedRecipes)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<SavedRecipe>()
            .HasIndex(s => new { s.UserId, s.RecipeId })
            .IsUnique();

        mb.Entity<UserPreferences>()
            .HasOne(p => p.User)
            .WithOne(u => u.Preferences)
            .HasForeignKey<UserPreferences>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<UserPreferences>()
            .HasIndex(p => p.UserId)
            .IsUnique();
    }
}
