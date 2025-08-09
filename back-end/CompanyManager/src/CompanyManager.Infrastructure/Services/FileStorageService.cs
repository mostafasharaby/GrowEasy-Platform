using CompanyManager.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace CompanyManager.Infrastructure.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        public async Task<string> SaveFileAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty.");

            var folderPath = Path.Combine(_basePath, folderName);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return Path.Combine(folderName, fileName).Replace("\\", "/");
        }

        public async Task DeleteFileAsync(string fileName, string folderName)
        {
            var filePath = Path.Combine(_basePath, folderName, Path.GetFileName(fileName));

            if (File.Exists(filePath))
            {
                await Task.Run(() => File.Delete(filePath));
            }
        }
    }
}
