using CompanyManager.Application.Responses;
using Microsoft.AspNetCore.Authentication;

namespace CompanyManager.Application.Interfaces
{
    public interface IGoogleService
    {
        AuthenticationProperties GetGoogleLoginProperties(string redirectUri);
        Task<AuthResponse> GoogleLoginCallbackAsync();
    }
}
