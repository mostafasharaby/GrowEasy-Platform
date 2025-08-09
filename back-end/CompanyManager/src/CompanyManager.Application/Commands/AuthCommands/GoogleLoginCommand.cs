using MediatR;
using Microsoft.AspNetCore.Authentication;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record GoogleLoginCommand(string? RedirectUri)
        : IRequest<AuthenticationProperties>;
}