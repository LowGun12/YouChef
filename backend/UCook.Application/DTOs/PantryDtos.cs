using System.ComponentModel.DataAnnotations;

namespace UCook.Application.DTOs;

public record PantryItemDto(
    Guid Id,
    Guid UserId,
    string Name,
    string Category,
    double? Quantity,
    string? Unit,
    string? Barcode,
    DateTime? ExpiresAt,
    DateTime AddedAt
);

public record AddPantryItemRequest(
    [Required, MinLength(1)] string Name,
    [Required] string Category,
    double? Quantity,
    string? Unit,
    string? Barcode,
    DateTime? ExpiresAt
);
