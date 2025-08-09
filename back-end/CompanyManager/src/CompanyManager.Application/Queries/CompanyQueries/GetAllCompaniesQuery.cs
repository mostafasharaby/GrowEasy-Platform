using CompanyManager.Application.DTOs;
using CompanyManager.Application.Pagination;
using MediatR;

namespace CompanyManager.Application.Queries.CompanyQueries
{
    public class GetAllCompaniesQuery : IRequest<PaginatedResult<CompanyDto>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
