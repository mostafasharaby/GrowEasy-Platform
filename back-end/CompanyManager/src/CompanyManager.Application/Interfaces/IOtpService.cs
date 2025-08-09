using CompanyManager.Application.Responses;

namespace CompanyManager.Application.Interfaces
{
    public interface IOtpService
    {
        Task<Response<string>> ValidateOtpAsync(string email, string otp);
        Task<Response<string>> SetPasswordAsync(string email, string otp, string newPassword, string confirmPassword);
    }
}
