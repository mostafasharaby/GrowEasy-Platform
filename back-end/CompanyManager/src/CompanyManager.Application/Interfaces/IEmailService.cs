using CompanyManager.Application.Responses;

namespace CompanyManager.Application.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(Message message);
    }
}
