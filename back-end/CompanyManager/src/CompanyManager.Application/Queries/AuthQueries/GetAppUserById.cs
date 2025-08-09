using CompanyManager.Application.DTOs;
using CompanyManager.Application.Responses;
using MediatR;

namespace Auth.Application.Queries
{
    public record GetAppUserById(string UserId) : IRequest<Response<UserDto>>;
}
