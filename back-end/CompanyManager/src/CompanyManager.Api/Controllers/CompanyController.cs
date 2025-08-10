using CompanyManager.Application.Commands.CompanyCommands;
using CompanyManager.Application.Queries.CompanyQueries;
using CompanyManager.Application.Responses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CompanyManager.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<CompanyController> _logger;

        public CompanyController(IMediator mediator, ILogger<CompanyController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost("register/company")]
        public async Task<IActionResult> RegisterCompany([FromForm] RegisterCompanyCommand command)
        {
            var result = await _mediator.Send(command);
            return (bool)result.Succeeded! ? CreatedAtAction(nameof(RegisterCompany), new { id = result.Data }, result) : BadRequest(result);
        }

        [HttpPost("validate-otp")]
        public async Task<IActionResult> ValidateOtp([FromBody] ValidateOtpCommand command)
        {
            var result = await _mediator.Send(command);
            return (bool)result.Succeeded! ? Ok(result) : BadRequest(result);
        }

        [HttpPost("set-password")]
        public async Task<IActionResult> SetPassword([FromBody] SetPasswordCommand command)
        {
            var result = await _mediator.Send(command);
            return (bool)result.Succeeded! ? Ok(result) : BadRequest(result);
        }

        [HttpGet("details")]
        [Authorize]
        public async Task<IActionResult> GetCompanyDetails()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                _logger.LogWarning("Unauthorized access attempt to GetCompanyDetails.");
                return Unauthorized(new Response<string> { Succeeded = false, Message = "User not authenticated." });
            }

            try
            {
                var company = await _mediator.Send(new GetCompanyByEmailQuery { Email = email });
                return (bool)company.Succeeded! ? Ok(company) : BadRequest(company);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching company details for email: {Email}", email);
                return StatusCode(500, new Response<string> { Succeeded = false, Message = "An error occurred while fetching company details." });
            }
        }

    }
}

