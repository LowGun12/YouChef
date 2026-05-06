namespace UCook.Domain.Entities;

public class UserPreferences
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string AllergiesJson { get; set; } = "[]";
    public string DietaryJson { get; set; } = "[]";
    public string CuisinePrefsJson { get; set; } = "[]";
    public bool OnboardingComplete { get; set; } = false;
    public User User { get; set; } = null!;
}
