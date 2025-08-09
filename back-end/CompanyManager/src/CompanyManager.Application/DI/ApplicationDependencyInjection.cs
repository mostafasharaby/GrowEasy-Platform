using Auth.Application.Helpers;
using CompanyManager.Application.Behavior;
using CompanyManager.Application.Handlers.AuthHandlers;
using CompanyManager.Application.Handlers.CompanyHandlers;
using CompanyManager.Application.Helpers;
using CompanyManager.Application.Resources;
using CompanyManager.Application.Responses;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace CompanyManager.Application.DI
{
    public static class ApplicationDependencyInjection
    {
        public static IServiceCollection AddIApplicationDI(this IServiceCollection services)
        {
            services.AddTransient<ResponseHandler>();
            services.AddSingleton<SharedResource>();

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AppUserHandler).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AuthHandler).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(AppUserQueryHandler).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CompanyHandler).Assembly));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CompanyHandlerQuery).Assembly));

            services.AddScoped<IUserRegistrationHelper, UserRegistrationHelper>();

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            return services;
        }
    }
}
