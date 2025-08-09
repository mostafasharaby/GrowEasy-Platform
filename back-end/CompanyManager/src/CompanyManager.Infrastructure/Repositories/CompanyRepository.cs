using CompanyManager.Domain.Entities;
using CompanyManager.Domain.Repositories;
using CompanyManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CompanyManager.Infrastructure.Repositories
{
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        private readonly AppDbContext _context;

        public CompanyRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Company?> GetByEmailAsync(string email)
        {
            return await _context.Companies.FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<Company?> GetByIdAsync(string id)
        {
            return await _context.Companies.FindAsync(id);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Companies.AnyAsync(c => c.Email == email);
        }
    }
}
