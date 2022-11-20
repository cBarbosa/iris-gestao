using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContatoRepository: Repository<Contato>, IContatoRepository
{
    public ContatoRepository(ILogger<Contato> Logger)
        : base(Logger)
    {
    }
}