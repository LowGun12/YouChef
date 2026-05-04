using UCook.Domain.Entities;

namespace UCook.Application.Interfaces;

public interface IUserRepository
{
    Task<bool> ExistsByEmailAsync(string email);
    Task<User?> FindByEmailAsync(string email);
    Task<User> CreateAsync(User user);
}
