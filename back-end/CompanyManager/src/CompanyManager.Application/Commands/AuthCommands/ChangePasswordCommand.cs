using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record ChangePasswordCommand(string? CurrentPassword, string? NewPassword, string? ConfirmNewPassword)
        : IRequest<Response<string>>;
}