using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ContratoAluguelUnidadeRepository : Repository<ContratoAluguelUnidade>, IContratoAluguelUnidadeRepository
{
    public ContratoAluguelUnidadeRepository(IConfiguration configuration, ILogger<ContratoAluguelUnidade> logger)
        : base(configuration, logger)
    {

    }
}