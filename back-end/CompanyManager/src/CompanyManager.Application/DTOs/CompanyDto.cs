namespace CompanyManager.Application.DTOs
{
    public class CompanyDto
    {
        public Guid Id { get; set; }
        public string CompanyNameArabic { get; set; } = string.Empty;
        public string CompanyNameEnglish { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? LogoPath { get; set; }
        public bool IsEmailVerified { get; set; }
    }
}
