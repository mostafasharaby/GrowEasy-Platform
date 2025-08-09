using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace CompanyManager.Application.DTOs
{
    public class SignUpDto
    {
        [Required(ErrorMessage = "Company Arabic name is required")]
        public string? CompanyNameArabic { get; set; }

        [Required(ErrorMessage = "Company English name is required")]
        public string? CompanyNameEnglish { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }

        [Phone(ErrorMessage = "Invalid phone number")]
        public string? PhoneNumber { get; set; }

        [Url(ErrorMessage = "Invalid website URL")]
        public string? WebsiteUrl { get; set; }

        public IFormFile? Logo { get; set; }
    }
}
