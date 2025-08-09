using CompanyManager.Domain.Entities;

namespace CompanyManager.Domain.Repositories
{
    public interface ICompanyRepository : IGenericRepository<Company>
    {
        Task<Company?> GetByEmailAsync(string email);
        Task<Company?> GetByIdAsync(string id);
        Task<bool> EmailExistsAsync(string email);
    }
}
