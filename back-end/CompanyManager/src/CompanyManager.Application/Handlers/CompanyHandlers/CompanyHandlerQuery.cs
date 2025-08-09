using AutoMapper;
using CompanyManager.Application.DTOs;
using CompanyManager.Application.Queries.CompanyQueries;
using CompanyManager.Application.Responses;
using CompanyManager.Domain.Repositories;
using MediatR;

namespace CompanyManager.Application.Handlers.CompanyHandlers
{
    internal class CompanyHandlerQuery : IRequestHandler<GetCompanyByIdQuery, Response<CompanyDto>>,
                                          IRequestHandler<GetCompanyByEmailQuery, Response<CompanyDto>>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        private readonly ResponseHandler _responseHandler;

        public CompanyHandlerQuery(
            ICompanyRepository companyRepository,
            IMapper mapper,
            ResponseHandler responseHandler)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
            _responseHandler = responseHandler;
        }

        public async Task<Response<CompanyDto>> Handle(GetCompanyByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var company = await _companyRepository.GetByIdAsync(request.CompanyId);
                if (company == null)
                {
                    return _responseHandler.BadRequest<CompanyDto>("Company not found");
                }

                var companyDto = _mapper.Map<CompanyDto>(company);
                return _responseHandler.Success(companyDto);
            }
            catch (Exception ex)
            {
                return _responseHandler.NotFound<CompanyDto>(ex.Message);
            }
        }

        public async Task<Response<CompanyDto>> Handle(GetCompanyByEmailQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var company = await _companyRepository.GetByEmailAsync(request.Email);
                if (company == null)
                {
                    return _responseHandler.BadRequest<CompanyDto>("Company not found for the provided email");
                }

                var companyDto = _mapper.Map<CompanyDto>(company);
                return _responseHandler.Success(companyDto);
            }
            catch (Exception ex)
            {
                return _responseHandler.NotFound<CompanyDto>(ex.Message);
            }
        }

    }
}
