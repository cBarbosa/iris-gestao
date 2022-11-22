using IrisGestao.ApplicationService.Repository.Interfaces;
using IrisGestao.ApplicationService.Services.Interface;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Service.Impl;

public class CategoriaImovelService: ICategoriaImovelService
{
    private readonly ICategoriaImovelRepository categoriaImovelRepository;
    
    public CategoriaImovelService(ICategoriaImovelRepository CategoriaImovelRepository)
    {
        this.categoriaImovelRepository = CategoriaImovelRepository;
    }
    
    public async Task<CommandResult> GetAll()
    {
        var categoriaImoveis = await Task.FromResult(categoriaImovelRepository.GetAll());

        return !categoriaImoveis.Any()
            ? new CommandResult(false,"Não foi possível carregar as informações", null!)
            : new CommandResult(true,"Dados carregados com sucesso", categoriaImoveis);
    }
}