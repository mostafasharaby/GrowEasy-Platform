﻿using CompanyManager.Domain.Repositories;
using CompanyManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Linq.Expressions;

namespace CompanyManager.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {

        protected readonly AppDbContext _dbContext;
        public GenericRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public virtual async Task<List<T>> GetByAsync(Expression<Func<T, bool>> expression)
        {
            return await _dbContext.Set<T>().Where(expression).ToListAsync();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }
        public async Task<T> GetByIdStringAsync(string id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public virtual async Task<T> GetByNameAsync(string name)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(e => EF.Property<string>(e, "Name") == name);
        }

        public IQueryable<T> GetTableNoTracking()
        {
            return _dbContext.Set<T>().AsNoTracking().AsQueryable();
        }

        public virtual async Task AddRangeAsync(ICollection<T> entities)
        {
            await _dbContext.Set<T>().AddRangeAsync(entities);
            await _dbContext.SaveChangesAsync();
        }
        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public async Task<T> UpdateAsync(T entity)
        {
            _dbContext.Set<T>().Update(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        public virtual async Task DeleteAsync(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> DeleteByIdAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
            {
                Log.Error($"{typeof(T).Name} with ID {id} not found.");
                return false;
            }

            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByIdStringAsync(string id)
        {
            var entity = await GetByIdStringAsync(id);
            if (entity == null)
            {
                Log.Error($"{typeof(T).Name} with ID {id} not found.");
                return false;
            }

            _dbContext.Set<T>().Remove(entity);
            return true;
        }
        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }


        public IQueryable<T> GetTableAsTracking()
        {
            return _dbContext.Set<T>().AsQueryable();
        }

        public virtual async Task UpdateRangeAsync(ICollection<T> entities)
        {
            _dbContext.Set<T>().UpdateRange(entities);
            await _dbContext.SaveChangesAsync();
        }
        public virtual async Task<List<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task<bool> ExistsAsync<T>(Expression<Func<T, bool>> predicate) where T : class
        {
            return await _dbContext.Set<T>().AnyAsync(predicate);
        }
    }

}
