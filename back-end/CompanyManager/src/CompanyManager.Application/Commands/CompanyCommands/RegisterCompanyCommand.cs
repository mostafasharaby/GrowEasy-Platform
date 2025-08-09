using CompanyManager.Application.Responses;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CompanyManager.Application.Commands.CompanyCommands
{
    public record RegisterCompanyCommand : IRequest<Response<string>>
    {
        public string ArabicName { get; set; } = string.Empty;
        public string EnglishName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string WebsiteUrl { get; set; } = string.Empty;
        public IFormFile? Logo { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}
