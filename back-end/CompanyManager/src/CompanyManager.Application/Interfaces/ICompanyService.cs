using CompanyManager.Application.DTOs;
using CompanyManager.Application.Responses;

namespace CompanyManager.Application.Interfaces
{
    public interface ICompanyService
    {
        Task<SignUpResultDto> SignUpAsync(SignUpDto signUpDto);
        Task<bool> ValidateOtpAsync(OtpValidationDto otpValidationDto);
        Task<bool> SetPasswordAsync(SetPasswordDto setPasswordDto);
        Task<AuthResponse> LoginAsync(LoginDto loginDto);
        Task<CompanyDto> GetCompanyAsync(Guid companyId);
    }
}
