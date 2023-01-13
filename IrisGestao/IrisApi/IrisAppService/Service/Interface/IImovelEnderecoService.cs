using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IImovelEnderecoService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> Insert(CriarImovelEnderecoCommand cmd);
    Task<CommandResult> Update(int? codigo, CriarImovelEnderecoCommand cmd);

    Task<CommandResult> Delete(int? codigo);
    Task<CommandResult> BuscarEnderecoPorImovel(int codigo);
    Task<CommandResult> BuscarEnderecoPorCEP(string cep);
}