﻿using Auth.Application.Commands;
using AutoMapper;
using CompanyManager.Application.Commands.AuthCommands;
using CompanyManager.Application.DTOs;
using CompanyManager.Application.Helpers;
using CompanyManager.Application.Responses;
using CompanyManager.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CompanyManager.Application.Handlers.AuthHandlers
{
    public class AppUserHandler : IRequestHandler<RegisterAdminCommand, Response<string>>,
                                   IRequestHandler<RegisterUserCommand, Response<string>>,
                                   IRequestHandler<UpdateAppUserCommand, Response<UserDto>>,
                                   IRequestHandler<UpdateProfileRequest, Response<string>>,
                                   IRequestHandler<DeleteAppUserCommand, Response<string>>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public readonly ResponseHandler _responseHandler;
        private readonly IUserRegistrationHelper _userRegistrationHelper;


        public AppUserHandler(UserManager<AppUser> userManager, IMapper mapper, ResponseHandler responseHandler, IUserRegistrationHelper userRegistrationHelper)
        {
            _userManager = userManager;
            _mapper = mapper;
            _responseHandler = responseHandler;
            _userRegistrationHelper = userRegistrationHelper;
        }

        public async Task<Response<string>> Handle(RegisterAdminCommand request, CancellationToken cancellationToken)
        {
            var user = _mapper.Map<AppUser>(request);
            return await _userRegistrationHelper.RegisterUserAsync(user, request.Password!, "admin");
        }

        public async Task<Response<string>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var user = _mapper.Map<AppUser>(request);
            return await _userRegistrationHelper.RegisterUserAsync(user, request.Password!, "user");
        }


        public async Task<Response<UserDto>> Handle(UpdateAppUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.Id!);
            if (user == null)
            {
                return _responseHandler.NotFound<UserDto>("User not found.");
            }

            _mapper.Map(request, user);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return _responseHandler.BadRequest<UserDto>(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            var updatedUserDto = _mapper.Map<UserDto>(user);
            return _responseHandler.Success(updatedUserDto);
        }

        public async Task<Response<string>> Handle(UpdateProfileRequest request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
                return _responseHandler.NotFound<string>("User not found.");

            _mapper.Map(request.Command, user);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return _responseHandler.BadRequest<string>(string.Join(", ", result.Errors.Select(e => e.Description)));

            return _responseHandler.Success("Profile updated successfully.");
        }

        public async Task<Response<string>> Handle(DeleteAppUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.Id!);
            if (user == null)
                return _responseHandler.NotFound<string>("User not found.");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return _responseHandler.BadRequest<string>(string.Join(", ", result.Errors.Select(e => e.Description)));

            return _responseHandler.Success("Account deleted successfully.");
        }
    }
}
