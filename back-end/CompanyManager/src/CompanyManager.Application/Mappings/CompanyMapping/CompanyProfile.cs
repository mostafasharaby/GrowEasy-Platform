using AutoMapper;
using CompanyManager.Application.Commands.CompanyCommands;
using CompanyManager.Application.DTOs;
using CompanyManager.Domain.Entities;

public class CompanyProfile : Profile
{
    public CompanyProfile()
    {
        CreateMap<Company, CompanyDto>();

        CreateMap<RegisterCompanyCommand, Company>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CompanyNameArabic, opt => opt.MapFrom(src => src.ArabicName))
            .ForMember(dest => dest.CompanyNameEnglish, opt => opt.MapFrom(src => src.EnglishName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.WebsiteUrl, opt => opt.MapFrom(src => src.WebsiteUrl))
            .ForMember(dest => dest.LogoPath, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(_ => false))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.AppUserId, opt => opt.Ignore())
            .ForMember(dest => dest.AppUser, opt => opt.Ignore());
    }
}
