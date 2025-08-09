using Microsoft.AspNetCore.Http;

namespace CompanyManager.Application.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
    }
}
