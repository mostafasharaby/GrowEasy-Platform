using CompanyManager.Application.DTOs;
using CompanyManager.Application.Responses;
using MediatR;

namespace CompanyManager.Application.Queries.CompanyQueries
{
    public class GetCompanyByIdQuery : IRequest<Response<CompanyDto>>
    {
        public string? CompanyId { get; set; }
    }
}
