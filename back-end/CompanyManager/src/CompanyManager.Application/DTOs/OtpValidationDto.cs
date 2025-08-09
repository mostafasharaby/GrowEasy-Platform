using System.ComponentModel.DataAnnotations;

namespace CompanyManager.Application.DTOs
{
    public class OtpValidationDto
    {
        [Required]
        public Guid CompanyId { get; set; }

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public string? OtpCode { get; set; }
    }
}
