using System.ComponentModel.DataAnnotations;

namespace UCook.Application.DTOs;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record RegisterRequest(
    [Required, MinLength(2)] string Name,
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);

public record AuthResponse(UserDto User, string Token);

public record UserDto(Guid Id, string Name, string Email, DateTime CreatedAt);
