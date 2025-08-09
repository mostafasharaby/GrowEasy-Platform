using CompanyManager.Application.Commands.CompanyCommands;
using FluentValidation;

namespace CompanyManager.Application.Validators.CompanyValidators
{
    public class ValidateOtpCommandValidator : AbstractValidator<ValidateOtpCommand>
    {
        public ValidateOtpCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Company Email is required");

            RuleFor(x => x.Otp)
                .NotEmpty().WithMessage("OTP code is required")
                .Length(6).WithMessage("OTP must be 6 digits");
        }
    }
}
