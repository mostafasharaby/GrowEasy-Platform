using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Commands.CompanyCommands
{
    public record DeleteCompanyCommand(string CompanyUserId) : IRequest<Response<bool>>;
}
