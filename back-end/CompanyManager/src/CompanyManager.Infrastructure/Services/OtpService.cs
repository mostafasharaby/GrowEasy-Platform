using CompanyManager.Application.Interfaces;
using CompanyManager.Application.Responses;
using CompanyManager.Domain.Entities;
using CompanyManager.Domain.Repositories;
using Microsoft.AspNetCore.Identity;

namespace CompanyManager.Infrastructure.Services
{
    public class OtpService : IOtpService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IOtpRepository _otpRepository;
        private readonly ResponseHandler _responseHandler;

        public OtpService(
            UserManager<AppUser> userManager,
            IOtpRepository otpRepository,
            ResponseHandler responseHandler)
        {
            _userManager = userManager;
            _otpRepository = otpRepository;
            _responseHandler = responseHandler;
        }

        public async Task<Response<string>> ValidateOtpAsync(string email, string otp)
        {
            var otpRecord = await _otpRepository.GetValidOtpAsync(email, otp);
            if (otpRecord == null)
                return _responseHandler.BadRequest<string>("Invalid or expired OTP.");

            return _responseHandler.Success("OTP validated successfully.");
        }

        public async Task<Response<string>> SetPasswordAsync(string email, string otp, string newPassword, string confirmPassword)
        {
            if (newPassword != confirmPassword)
                return _responseHandler.BadRequest<string>("Passwords do not match.");

            if (!IsValidPassword(newPassword))
                return _responseHandler.BadRequest<string>("Password must be at least 7 characters, contain one capital letter, one special character, and one number.");

            var otpRecord = await _otpRepository.GetValidOtpAsync(email, otp);
            if (otpRecord == null)
                return _responseHandler.BadRequest<string>("Invalid or expired OTP.");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return _responseHandler.NotFound<string>("User not found.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            if (!result.Succeeded)
                return _responseHandler.BadRequest<string>(string.Join(", ", result.Errors.Select(e => e.Description)));

            await _otpRepository.MarkOtpAsUsedAsync(otpRecord.Id);
            return _responseHandler.Success("Password set successfully.");
        }

        private bool IsValidPassword(string password)
        {
            if (password.Length <= 6)
                return false;

            bool hasUpperCase = password.Any(char.IsUpper);
            bool hasDigit = password.Any(char.IsDigit);
            bool hasSpecialChar = password.Any(c => !char.IsLetterOrDigit(c));

            return hasUpperCase && hasDigit && hasSpecialChar;
        }
    }
}
