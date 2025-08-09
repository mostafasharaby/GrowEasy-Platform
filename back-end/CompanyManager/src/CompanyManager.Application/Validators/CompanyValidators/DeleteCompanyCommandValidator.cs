using CompanyManager.Application.Commands.CompanyCommands;
using FluentValidation;

namespace CompanyManager.Application.Validators.CompanyValidators
{
    public class DeleteCompanyCommandValidator : AbstractValidator<DeleteCompanyCommand>
    {
        public DeleteCompanyCommandValidator()
        {
            RuleFor(x => x.CompanyUserId)
                .NotEmpty().WithMessage("Company ID is required");
        }
    }
}
