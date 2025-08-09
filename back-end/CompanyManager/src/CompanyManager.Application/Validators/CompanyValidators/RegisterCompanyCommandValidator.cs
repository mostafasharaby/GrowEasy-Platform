using CompanyManager.Application.Commands.CompanyCommands;
using FluentValidation;

namespace CompanyManager.Application.Validators.CompanyValidators
{
    public class RegisterCompanyCommandValidator : AbstractValidator<RegisterCompanyCommand>
    {
        public RegisterCompanyCommandValidator()
        {
            RuleFor(x => x.ArabicName)
                .NotEmpty().WithMessage("Arabic Name is required");

            RuleFor(x => x.EnglishName)
                .NotEmpty().WithMessage("English Name is required");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\+?\d{10,15}$")
                .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber))
                .WithMessage("Invalid phone number format");

            RuleFor(x => x.WebsiteUrl)
                .Matches(@"^(https?:\/\/)?([\w\-])+\.{1}[a-zA-Z]{2,}([\/\w\-\.\?=%&]*)?$")
                .When(x => !string.IsNullOrWhiteSpace(x.WebsiteUrl))
                .WithMessage("Invalid website URL format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])")
                .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");

            RuleFor(x => x.Logo)
                .Must(file =>
                {
                    if (file == null) return true;
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                    var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
                    return allowedExtensions.Contains(extension);
                })
                .WithMessage("Logo must be a JPG or PNG image");
        }
    }
}
