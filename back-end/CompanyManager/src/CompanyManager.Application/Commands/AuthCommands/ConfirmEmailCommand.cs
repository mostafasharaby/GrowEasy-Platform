using CompanyManager.Application.Responses;
using CompanyManager.Domain.Entities;
using MediatR;

namespace CompanyManager.Application.Commands.AuthCommands
{
    public record ConfirmEmailCommand(string UserId, string Token)
        : IRequest<Response<AppUser>>;
}