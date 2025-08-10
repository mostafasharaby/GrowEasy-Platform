using CompanyManager.API.Controllers;
using CompanyManager.Application.DTOs;
using CompanyManager.Application.Queries.CompanyQueries;
using CompanyManager.Application.Responses;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;

namespace CompanyManager.Tests.Controllers
{
    public class CompanyControllerTests
    {
        private readonly Mock<IMediator> _mediatorMock;
        private readonly Mock<ILogger<CompanyController>> _loggerMock;
        private readonly CompanyController _controller;

        public CompanyControllerTests()
        {
            _mediatorMock = new Mock<IMediator>();
            _loggerMock = new Mock<ILogger<CompanyController>>();
            _controller = new CompanyController(_mediatorMock.Object, _loggerMock.Object);
        }

        private Response<T> CreateResponse<T>(T data, bool succeeded = true, string message = "")
        {
            return new Response<T> { Data = data, Succeeded = succeeded, Message = message };
        }

        [Fact]
        public async Task GetCompanyDetails_AuthenticatedUser_ReturnsOk()
        {
            // Arrange
            var email = "test@example.com";
            var companyDto = new CompanyDto
            {
                Id = Guid.NewGuid(),
                CompanyNameArabic = "شركة اختبار",
                CompanyNameEnglish = "Test Company",
                Email = email,
                PhoneNumber = "1234567890",
                WebsiteUrl = "https://test.com",
                LogoPath = "/Uploads/company-logos/test-logo.jpg"
            };

            _mediatorMock.Setup(m => m.Send(It.Is<GetCompanyByEmailQuery>(q => q.Email == email), It.IsAny<CancellationToken>()))
                .ReturnsAsync(CreateResponse(companyDto, true, "Company details retrieved successfully"));

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email)
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            // Act
            var result = await _controller.GetCompanyDetails();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            var response = okResult!.Value as Response<CompanyDto>;
            response!.Data.Should().BeEquivalentTo(companyDto);
            response.Succeeded.Should().BeTrue();
            response.Message.Should().Be("Company details retrieved successfully");
        }

        [Fact]
        public async Task GetCompanyDetails_UnauthenticatedUser_ReturnsUnauthorized()
        {
            // Arrange
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            // Act
            var result = await _controller.GetCompanyDetails();

            // Assert
            result.Should().BeOfType<UnauthorizedObjectResult>();
            var unauthorizedResult = result as UnauthorizedObjectResult;
            var response = unauthorizedResult!.Value as Response<string>;
            response!.Succeeded.Should().BeFalse();
            response.Message.Should().Be("User not authenticated.");
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Unauthorized access attempt to GetCompanyDetails")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once());
        }

        [Fact]
        public async Task GetCompanyDetails_CompanyNotFound_ReturnsBadRequest()
        {
            // Arrange
            var email = "test@example.com";
            _mediatorMock.Setup(m => m.Send(It.Is<GetCompanyByEmailQuery>(q => q.Email == email), It.IsAny<CancellationToken>()))
                .ReturnsAsync(CreateResponse<CompanyDto>(null!, false, "Company not found for the provided email"));

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email)
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            // Act
            var result = await _controller.GetCompanyDetails();

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            var response = badRequestResult!.Value as Response<CompanyDto>;
            response!.Succeeded.Should().BeFalse();
            response.Message.Should().Be("Company not found for the provided email");
        }

        [Fact]
        public async Task GetCompanyDetails_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange
            var email = "test@example.com";
            var exceptionMessage = "Database connection failed";
            _mediatorMock.Setup(m => m.Send(It.Is<GetCompanyByEmailQuery>(q => q.Email == email), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception(exceptionMessage));

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email)
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            // Act
            var result = await _controller.GetCompanyDetails();

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult!.StatusCode.Should().Be(500);
            var response = objectResult.Value as Response<string>;
            response!.Succeeded.Should().BeFalse();
            response.Message.Should().Be("An error occurred while fetching company details.");
            _loggerMock.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains($"Error fetching company details for email: {email}")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once());
        }
    }
}