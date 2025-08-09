using System.ComponentModel.DataAnnotations;

namespace CompanyManager.Domain.Entities
{
    public class Company
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(200)]
        public string? CompanyNameArabic { get; set; }

        [Required]
        [MaxLength(200)]
        public string? CompanyNameEnglish { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(500)]
        public string? WebsiteUrl { get; set; }

        [MaxLength(500)]
        public string? LogoPath { get; set; }

        [MaxLength(500)]
        public string? PasswordHash { get; set; }

        public bool IsEmailVerified { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public string AppUserId { get; set; } = string.Empty; // Link to AppUser
        public virtual AppUser AppUser { get; set; } = null!;
    }
    //public class Company
    //{
    //    public string Id { get; set; } = Guid.NewGuid().ToString();
    //    public string ArabicName { get; set; } = string.Empty;
    //    public string EnglishName { get; set; } = string.Empty;
    //    public string Email { get; set; } = string.Empty;
    //    public string PhoneNumber { get; set; } = string.Empty;
    //    public string WebsiteUrl { get; set; } = string.Empty;
    //    public string LogoUrl { get; set; } = string.Empty;
    //    public string AppUserId { get; set; } = string.Empty; // Link to AppUser
    //    public virtual AppUser AppUser { get; set; } = null!;
    //}
}
