using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IImovelRepository : IRepository<Imovel>, IDisposable
{
    IEnumerable<Imovel> GetById(int codigo);
}