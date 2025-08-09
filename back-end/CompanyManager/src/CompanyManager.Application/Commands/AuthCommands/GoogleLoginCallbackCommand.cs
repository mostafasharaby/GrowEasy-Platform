using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record GoogleLoginCallbackCommand()
        : IRequest<AuthResponse>;
}