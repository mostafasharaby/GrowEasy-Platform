namespace CompanyManager.Application.DTOs
{
    public class SignUpResultDto
    {
        public Guid CompanyId { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string? OtpCode { get; set; }
    }
}
