using AutoMapper;
using CompanyManager.Application.Commands.CompanyCommands;
using CompanyManager.Application.Helpers;
using CompanyManager.Application.Interfaces;
using CompanyManager.Application.Responses;
using CompanyManager.Domain.Entities;
using MediatR;

namespace CompanyManager.Application.Handlers.CompanyHandlers
{
    public class CompanyHandler :
         IRequestHandler<RegisterCompanyCommand, Response<string>>,
         IRequestHandler<ValidateOtpCommand, Response<string>>,
         IRequestHandler<SetPasswordCommand, Response<string>>
    {
        private readonly IUserRegistrationHelper _userRegistrationHelper;
        private readonly IOtpService _otpService;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public CompanyHandler(
            IUserRegistrationHelper userRegistrationHelper,
            IOtpService otpService,
            IFileService fileService,
            IMapper mapper)
        {
            _userRegistrationHelper = userRegistrationHelper;
            _otpService = otpService;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<Response<string>> Handle(RegisterCompanyCommand request, CancellationToken cancellationToken)
        {
            string logoUrl = string.Empty;
            if (request.Logo != null)
            {
                logoUrl = await _fileService.UploadFileAsync(request.Logo, "company-logos");
            }

            var company = _mapper.Map<Company>(request);
            company.LogoPath = logoUrl;

            return await _userRegistrationHelper.RegisterCompanyAsync(company, request.Password);
        }

        public async Task<Response<string>> Handle(ValidateOtpCommand request, CancellationToken cancellationToken)
        {
            return await _otpService.ValidateOtpAsync(request.Email, request.Otp);
        }

        public async Task<Response<string>> Handle(SetPasswordCommand request, CancellationToken cancellationToken)
        {
            return await _otpService.SetPasswordAsync(request.Email, request.Otp, request.NewPassword, request.ConfirmPassword);
        }
    }
}
