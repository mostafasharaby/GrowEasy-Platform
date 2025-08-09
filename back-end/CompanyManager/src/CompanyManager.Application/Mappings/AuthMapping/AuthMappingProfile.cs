using Auth.Application.Commands;
using AutoMapper;
using CompanyManager.Application.Commands.AuthCommands;
using CompanyManager.Application.DTOs;
using CompanyManager.Domain.Entities;

namespace CompanyManager.Application.Mappings
{
    public class AuthMappingProfile : Profile
    {
        public AuthMappingProfile()
        {
            CreateMap<RegisterAdminCommand, AppUser>();
            CreateMap<LoginCommand, AppUser>();
            CreateMap<AppUser, UserDto>()
             .ConstructUsing(user => new UserDto(
                 user.Id,
                 user.UserName,
                 user.Email,
                 user.PhoneNumber,
                 user.ImageUrl
             ));
            CreateMap<AppUser, UserDto>().ReverseMap();

            CreateMap<UpdateAppUserCommand, AppUser>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateProfileCommand, AppUser>()
               .ForMember(dest => dest.Id, opt => opt.Ignore());

        }
    }
}
