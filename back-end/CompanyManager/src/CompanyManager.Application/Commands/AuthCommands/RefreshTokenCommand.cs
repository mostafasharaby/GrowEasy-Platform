using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record RefreshTokenCommand(string? AccessToken, string? RefreshToken)
        : IRequest<Response<AuthResponse>>;
}