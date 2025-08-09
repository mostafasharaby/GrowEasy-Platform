namespace CompanyManager.Application.Responses
{
    public class AuthResponse
    {
        public string? Token { get; set; }
        public DateTime? TokenExpiryTime { get; set; }
        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string? UserName { get; set; }
        public string? Message { get; set; }
        public bool? IsAuthenticated { get; set; }
    }
}
