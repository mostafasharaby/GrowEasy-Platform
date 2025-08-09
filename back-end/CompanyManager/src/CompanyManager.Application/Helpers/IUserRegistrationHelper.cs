using CompanyManager.Application.Responses;
using CompanyManager.Domain.Entities;

namespace CompanyManager.Application.Helpers
{
    public interface IUserRegistrationHelper
    {
        Task<Response<string>> RegisterUserAsync(AppUser user, string password, string role);
        Task<Response<string>> RegisterCompanyAsync(Company company, string password);
    }
}
