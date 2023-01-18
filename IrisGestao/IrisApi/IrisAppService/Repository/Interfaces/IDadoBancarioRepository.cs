using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IDadoBancarioRepository : IRepository<DadoBancario>, IDisposable
{
    
}