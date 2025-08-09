using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.CompanyCommands
{
    public record SetPasswordCommand : IRequest<Response<string>>
    {
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
