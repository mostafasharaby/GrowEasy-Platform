using CompanyManager.Domain.Entities;

namespace CompanyManager.Domain.Repositories
{
    public interface IOtpRepository
    {
        Task AddAsync(OtpRecord otpRecord);
        Task<OtpRecord?> GetValidOtpAsync(string email, string otp);
        Task MarkOtpAsUsedAsync(string otpId);
    }
}
