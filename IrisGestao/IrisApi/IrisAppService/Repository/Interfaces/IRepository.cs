using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IRepository<T> where T : BaseEntity<T>
{
    void Insert(T entity);
    void Delete(long id);
    void Update(T entity);
    T? GetById(long id);
    IEnumerable<T> GetAll();
}