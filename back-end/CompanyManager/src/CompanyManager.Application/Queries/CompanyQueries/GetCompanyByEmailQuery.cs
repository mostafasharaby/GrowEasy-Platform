using CompanyManager.Application.DTOs;
using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Queries.CompanyQueries
{
    public class GetCompanyByEmailQuery : IRequest<Response<CompanyDto>>
    {
        public string Email { get; set; } = string.Empty;
    }
}
