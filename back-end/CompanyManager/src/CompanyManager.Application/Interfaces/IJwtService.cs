using CompanyManager.Application.Responses;
using CompanyManager.Domain.Entities;

namespace CompanyManager.Application.Interfaces
{
    public interface IJwtService
    {
        Task<AuthResponse> GenerateJwtToken(AppUser user);
        Task<AuthResponse> RefreshToken(string expiredToken, string refreshToken);
    }
}
