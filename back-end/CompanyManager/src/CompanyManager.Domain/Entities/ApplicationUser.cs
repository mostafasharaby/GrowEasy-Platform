﻿using Microsoft.AspNetCore.Identity;

namespace CompanyManager.Domain.Entities
{

    public class AppUser : IdentityUser
    {

        public string? ImageUrl { get; set; }
        public string? RefreshToken { get; set; }
        public string? Token { get; set; }
        public DateTime? TokenExpiryTime { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string? CompanyId { get; set; }
        public virtual Company? Company { get; set; }
    }
}
