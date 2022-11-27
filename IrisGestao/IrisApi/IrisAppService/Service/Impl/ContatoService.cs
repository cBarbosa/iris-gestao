using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Emuns;

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
            ? new CommandResult(false, ErrorResponseEnums.Error_1005, null!)
            : new CommandResult(true, SuccessResponseEnums.Success_1005, contatos);
    }
}