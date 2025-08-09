using CompanyManager.Application.Helpers;
using CompanyManager.Application.Interfaces;
using CompanyManager.Application.Responses;
using CompanyManager.Domain.Entities;
using CompanyManager.Domain.Repositories;
using Microsoft.AspNetCore.Identity;
using System.Net;

namespace Auth.Application.Helpers
{
    public class UserRegistrationHelper : IUserRegistrationHelper
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly ResponseHandler _responseHandler;
        private readonly ICompanyRepository _companyRepository;
        private readonly IOtpRepository _otpRepository;
        public UserRegistrationHelper(
              UserManager<AppUser> userManager,
              IEmailService emailService,
              ResponseHandler responseHandler,
              ICompanyRepository companyRepository,
              IOtpRepository otpRepository)
        {
            _userManager = userManager;
            _emailService = emailService;
            _responseHandler = responseHandler;
            _companyRepository = companyRepository;
            _otpRepository = otpRepository;
        }

        public async Task<Response<string>> RegisterUserAsync(AppUser user, string password, string role)
        {
            var existingUserEmail = await _userManager.FindByEmailAsync(user.Email!);
            if (existingUserEmail != null)
                return _responseHandler.BadRequest<string>("Email is already in use.");

            var existingUserName = await _userManager.FindByNameAsync(user.UserName!);
            if (existingUserName != null)
                return _responseHandler.BadRequest<string>("UserName is already in use.");

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                return _responseHandler.BadRequest<string>(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await _userManager.AddToRoleAsync(user, role);

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = $"http://localhost:5253/api/Account/confirm-email?userId={user.Id}&token={WebUtility.UrlEncode(token)}";

            var emailBody = $"Hello {user.UserName},<br> Please confirm your email by clicking <a href='{confirmationLink}'>here</a>.";
            var message = new Message(new[] { user.Email! }, "Confirm Your Email", emailBody);

            try
            {
                _emailService.SendEmail(message);
                return _responseHandler.Success(user.Id, "Account created successfully. Please check your email to confirm your account.");
            }
            catch (Exception)
            {
                return _responseHandler.BadRequest<string>("Failed to send confirmation email.");
            }
        }
        public async Task<Response<string>> RegisterCompanyAsync(Company company, string password)
        {
            var existingCompany = await _companyRepository.GetByEmailAsync(company.Email);
            if (existingCompany != null)
                return _responseHandler.BadRequest<string>("Company email is already in use.");


            var user = new AppUser
            {
                UserName = company.CompanyNameEnglish,
                Email = company.Email,
                PhoneNumber = company.PhoneNumber,
                CompanyId = company.Id
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return _responseHandler.BadRequest<string>(string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, "Company");

            company.AppUserId = user.Id;
            await _companyRepository.AddAsync(company);

            var otp = GenerateOtp();
            var otpRecord = new OtpRecord
            {
                Email = company.Email,
                Otp = otp,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };
            await _otpRepository.AddAsync(otpRecord);

            var emailBody = $"Your OTP for email verification is: {otp}";
            var message = new Message(new[] { company.Email }, "Company Registration OTP", emailBody);

            try
            {
                _emailService.SendEmail(message);
                return _responseHandler.Success(user.Id, $"Company registered successfully. OTP sent to {company.Email}.");
            }
            catch (Exception)
            {
                return _responseHandler.BadRequest<string>("Failed to send OTP email.");
            }
        }

        private string GenerateOtp()
        {
            return new Random().Next(100000, 999999).ToString();
        }
    }
}

