namespace UCook.Domain.Entities;

public class PantryItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "other";
    public double? Quantity { get; set; }
    public string? Unit { get; set; }
    public string? Barcode { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
