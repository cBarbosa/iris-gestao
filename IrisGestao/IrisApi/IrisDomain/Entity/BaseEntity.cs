using System.ComponentModel.DataAnnotations;

namespace IrisGestao.Domain.Entity;

public abstract class BaseEntity<T>  where T : class
{   
    [Key]
    public int Id { get; set; }
}