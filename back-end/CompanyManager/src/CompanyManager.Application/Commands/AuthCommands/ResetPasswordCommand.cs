using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record ResetPasswordCommand(string? Email, string? Token, string? NewPassword, string? ConfirmNewPassword)
        : IRequest<Response<string>>;
}