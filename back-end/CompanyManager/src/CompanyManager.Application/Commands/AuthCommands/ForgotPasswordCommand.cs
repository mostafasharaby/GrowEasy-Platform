using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record ForgotPasswordCommand(string? Email)
        : IRequest<Response<string>>;
}