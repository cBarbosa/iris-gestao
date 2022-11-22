using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Service.Impl;

public class AnexoService: IAnexoService
{
    private readonly IAnexoRepository anexoRepository;
    
    public AnexoService(IAnexoRepository AnexoRepository)
    {
        this.anexoRepository = AnexoRepository;
    }

    public async Task<CommandResult> GetAll()
    {
        var Anexos = await Task.FromResult(anexoRepository.GetAll());

        return !Anexos.Any()
            ? new CommandResult(false, "Não foi possível carregar as informações", null!)
            : new CommandResult(true, "Dados carregados com sucesso", Anexos);
    }

    public async Task<CommandResult> GetByIdReferencia(Guid idReferencia)
    {
        var Anexos = await Task.FromResult(anexoRepository.GetAll());

        return !Anexos.Any()
            ? new CommandResult(false, "Não foi possível carregar as informações", null!)
            : new CommandResult(true, "Dados carregados com sucesso", Anexos.Where(x => x.GuidReferencia == idReferencia.ToString()));
    }
}