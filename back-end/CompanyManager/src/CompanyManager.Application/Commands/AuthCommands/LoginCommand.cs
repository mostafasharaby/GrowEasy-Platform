using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record LoginCommand(string? Email, string? Password)
        : IRequest<Response<AuthResponse>>;
}