using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class FormaPagamentoRepository : Repository<FormaPagamento>, IFormaPagamentoRepository
{
    public FormaPagamentoRepository(IConfiguration configuration, ILogger<FormaPagamento> logger)
        : base(configuration, logger)
    {
        
    }
}