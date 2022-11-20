using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Service.Impl;

public class ContatoService: IContatoService
{
    private readonly IContatoRepository contatoRepository;
    
    public ContatoService(IContatoRepository contatoRepository)
    {
        this.contatoRepository = contatoRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var contatos = await Task.FromResult(contatoRepository.GetAll());

        return !contatos.Any()
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", contatos);
    }
}