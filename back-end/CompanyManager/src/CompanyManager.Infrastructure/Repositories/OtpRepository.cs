using CompanyManager.Domain.Entities;
using CompanyManager.Domain.Repositories;
using CompanyManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CompanyManager.Infrastructure.Repositories
{
    public class OtpRepository : GenericRepository<OtpRecord>, IOtpRepository
    {
        public OtpRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<OtpRecord?> GetValidOtpAsync(string email, string otp)
        {
            return await _dbContext.OtpRecords
                .FirstOrDefaultAsync(o => o.Email == email && o.Otp == otp && !o.IsUsed && o.ExpiresAt > DateTime.UtcNow);
        }

        public async Task MarkOtpAsUsedAsync(string otpId)
        {
            var otp = await _dbContext.OtpRecords.FindAsync(otpId);
            if (otp != null)
            {
                otp.IsUsed = true;
                await _dbContext.SaveChangesAsync();
            }
        }

        Task IOtpRepository.AddAsync(OtpRecord otpRecord)
        {
            return AddAsync(otpRecord);
        }
    }
}
