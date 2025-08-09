using System.Linq.Expressions;

namespace CompanyManager.Domain.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<List<T>> GetByAsync(Expression<Func<T, bool>> expression);
        Task<T> GetByIdAsync(int id);
        Task<T> GetByIdStringAsync(string id);
        public Task<bool> ExistsAsync<T>(Expression<Func<T, bool>> predicate) where T : class;
        Task<T> GetByNameAsync(string name);
        Task SaveChangesAsync();
        IQueryable<T> GetTableNoTracking();
        Task<T> AddAsync(T entity);
        Task AddRangeAsync(ICollection<T> entities);
        Task<T> UpdateAsync(T entity);
        Task UpdateRangeAsync(ICollection<T> entities);
        Task DeleteAsync(T entity);
        Task<bool> DeleteByIdAsync(int id);
        Task<bool> DeleteByIdStringAsync(string id);

    }
}
