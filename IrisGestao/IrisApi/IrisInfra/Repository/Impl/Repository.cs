using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class Repository<TEntity>
    : IDisposable, IRepository<TEntity> where TEntity : BaseEntity<TEntity>
{
    #region properties

    protected ORM.IrisContext Db;

    protected DbSet<TEntity> DbSet;

    protected ILogger<TEntity> Logger;

    #endregion
    public Repository(ILogger<TEntity> Logger)
    {
        // Db = new ORM.IrisContext();
        DbSet = Db.Set<TEntity>();
        this.Logger = Logger;
    }
    
    public virtual void Dispose()
    {
        Db.Dispose();
    }

    public void Insert(TEntity entity)
    {
        DbSet.Add(entity);
        Db.SaveChanges();
    }

    public virtual void Delete(long id)
    {
        TEntity entity = DbSet.FirstOrDefault(t => t.Id == id);

        if (entity != null)
        {
            DbSet.Remove(entity);
            Db.SaveChanges();
        }
    }

    public virtual void Update(TEntity entity)
    {
        Db.Entry(entity).State = EntityState.Modified;

        DbSet.Update(entity);
        Db.SaveChanges();
    }

    public virtual TEntity GetById(long id)
    {
        return DbSet.FirstOrDefault(p => p.Id == id);
    }

    public virtual IEnumerable<TEntity> GetAll()
    {
        return DbSet.ToList();
    }
}