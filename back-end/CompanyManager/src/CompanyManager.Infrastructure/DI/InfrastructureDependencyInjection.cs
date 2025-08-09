using Auth.Infrastructure.Services;
using CompanyManager.Application.Interfaces;
using CompanyManager.Domain.Entities;
using CompanyManager.Domain.Repositories;
using CompanyManager.Infrastructure.Data;
using CompanyManager.Infrastructure.Repositories;
using CompanyManager.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Globalization;
using System.Text;


namespace CompanyManager.Infrastructure.DI
{
    public static class InfrastructureDependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<AppDbContext>(option =>
            {
                option.UseSqlServer(configuration.GetConnectionString("CompanyManagerConnection"),
                    sqlServerOption => sqlServerOption.EnableRetryOnFailure());
            });

            services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();




            //services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<ICompanyRepository, CompanyRepository>();
            services.AddScoped<IOtpRepository, OtpRepository>();



            //services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<IOtpService, OtpService>();

            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IGoogleService, GoogleService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IFileStorageService, FileStorageService>();

            ConfigureLockoutOptions(services);  // for Lockout 
            ConfigureLocalizationOptions(services); // for Localization
            ConfigureAuthenticationOptions(services, configuration);
            ConfigureCorsOptions(services);
            ConfigureAuthorizationOptions(services);
            ConfigureSwaggerOptions(services);

            return services;
        }

        private static void ConfigureSwaggerOptions(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Event Booking System",
                    Description = "ASP.NET Core Web API"
                });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme."
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new List<string>()
                    }
                });
            });
        }

        public static void UseSharedCulture(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                var culture = context.Request.Query["culture"];
                if (!string.IsNullOrWhiteSpace(culture))
                {
                    CultureInfo cultureInfo = new CultureInfo(culture!);
                    CultureInfo.CurrentCulture = cultureInfo;
                    CultureInfo.CurrentUICulture = cultureInfo;
                }
                await next();
            });
        }

        private static void ConfigureAuthorizationOptions(IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy("PermissionPolicy", builder =>
                {
                    builder.RequireClaim("Permission", "CanEditUsers");
                });
                options.AddPolicy("EmailPolicy", builder =>
                {
                    builder.RequireClaim("EmailVerified", "false")
                    ;
                });
            });
        }

        private static void ConfigureCorsOptions(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });
        }

        private static void ConfigureAuthenticationOptions(IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                //options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                //options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = configuration["Jwt:ValidIssuer"],
                        ValidateAudience = true,
                        ValidAudience = configuration["Jwt:ValidAudience"],
                        ValidateLifetime = true, // Enforce expiration check
                        ClockSkew = TimeSpan.Zero,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!))
                    };
                })
                .AddCookie()
                .AddGoogle(options =>
                {
                    options.ClientId = configuration["GoogleAuth:ClientId"]!;
                    options.ClientSecret = configuration["GoogleAuth:ClientSecret"]!;
                });
        }

        private static void ConfigureLocalizationOptions(IServiceCollection services)
        {
            services.AddLocalization(options => options.ResourcesPath = "");

            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                    new CultureInfo("en-US"),
                    new CultureInfo("ar-EG"),
                    new CultureInfo("fr-FR"),
                 };

                options.DefaultRequestCulture = new RequestCulture("ar-EG");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
            });
        }

        private static void ConfigureLockoutOptions(IServiceCollection services)
        {
            services.Configure<IdentityOptions>(op =>
            {
                op.Lockout.MaxFailedAccessAttempts = 5;
                op.Lockout.AllowedForNewUsers = true;
                op.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromSeconds(40);
            });
        }
        public static async Task EnsureRolesCreatedAsync(this RoleManager<IdentityRole> roleManager)
        {
            var roles = new[] { "Company", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }

}
