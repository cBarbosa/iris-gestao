using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.Repository.Impl;

public class ClienteRepository : Repository<Cliente>, IClienteRepository
{
    public ClienteRepository(IConfiguration configuration, ILogger<Cliente> logger)
        : base(configuration, logger)
    {
        
    }

    public IEnumerable<Cliente> GetById(int codigo)
    {
        var lstUnidades = DbSet.Include(x => x.IdTipoClienteNavigation)
                                .Include(x => x.Imovel)
                                    .ThenInclude(y => y.ImovelEndereco)
                                .Where(x => x.Id == codigo).ToList();

        return lstUnidades.AsEnumerable();
    }

    public async Task<CommandPagingResult?> GetAllPaging(int limit, int page)
    {
        var skip = (page - 1) * limit;

        try
        {
            var clientes = await DbSet
                .Include(x => x.IdTipoClienteNavigation)
                .Include(x => x.Imovel)
                    .ThenInclude(y => y.ImovelEndereco)
                .ToListAsync();

            var totalCount = clientes.Count();

            var clientesPaging = clientes.Skip(skip).Take(limit);

            if (clientesPaging.Any())
                return new CommandPagingResult(clientesPaging, totalCount, page, limit);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex.Message);
        }

        return null!;
    }
}