using CompanyManager.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CompanyManager.Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        #region DbSets
        public DbSet<Company> Companies { get; set; }
        public DbSet<OtpRecord> OtpRecords { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        #endregion


        #region Model Configuration
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<AppUser>()
                .HasOne(u => u.Company)
                .WithOne(c => c.AppUser)
                .HasForeignKey<Company>(c => c.AppUserId);

            //SeedRoles(modelBuilder);
            //SeedUsers(modelBuilder);
            //SeedUserRoles(modelBuilder);


        }
        #endregion

        #region Seed Data
        //private static void SeedRoles(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<IdentityRole>().HasData(
        //        new IdentityRole { Id = "roleId1", Name = "admin", NormalizedName = "ADMIN" },
        //        new IdentityRole { Id = "roleId2", Name = "user", NormalizedName = "USER" }
        //    );
        //}

        //private static void SeedUsers(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<AppUser>().HasData(
        //        new AppUser
        //        {
        //            Id = "user1",
        //            UserName = "Shady",
        //            Email = "Shady@example.com",
        //            NormalizedUserName = "SHADY",
        //            NormalizedEmail = "SHADY@EXAMPLE.COM"
        //        },
        //        new AppUser
        //        {
        //            Id = "user2",
        //            UserName = "Mohamed",
        //            Email = "Mohamed@example.com",
        //            NormalizedUserName = "MOHAMED",
        //            NormalizedEmail = "MOHAMED@EXAMPLE.COM"
        //        },
        //        new AppUser
        //        {
        //            Id = "admin1",
        //            UserName = "admin",
        //            Email = "admin@example.com",
        //            NormalizedUserName = "ADMIN",
        //            NormalizedEmail = "ADMIN@EXAMPLE.COM"
        //        }
        //    );
        //}

        //private static void SeedUserRoles(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<IdentityUserRole<string>>().HasData(
        //        new IdentityUserRole<string> { UserId = "admin1", RoleId = "roleId1" },
        //        new IdentityUserRole<string> { UserId = "user1", RoleId = "roleId2" },
        //        new IdentityUserRole<string> { UserId = "user2", RoleId = "roleId2" }
        //    );
        //}

        #endregion

        #region SaveChanges
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
        #endregion
    }
}
