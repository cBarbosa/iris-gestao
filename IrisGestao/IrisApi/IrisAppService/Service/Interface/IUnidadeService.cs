using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface IUnidadeService
{
    Task<CommandResult> GetAll();
    Task<CommandResult> GetById(int codigo);
    Task<CommandResult> Insert(Guid guidImovel, CriarUnidadeCommand cmd);
    Task<CommandResult> Update(Guid guid, CriarUnidadeCommand cmd);
    Task<CommandResult> Delete(int? codigo);
    Task<CommandResult> BuscarUnidadePorImovel(Guid uuid);
    Task<CommandResult> GetByUid(Guid guid);
    Task<CommandResult> Clone(Guid guid);
    Task<CommandResult> AlterarStatus(Guid guid, bool status);
    Task<CommandResult> LiberarUnidade(Guid guid);
    Task<CommandResult> LiberarUnidadesLocadas(ContratoAluguel contrato);
    Task<CommandResult> AlocarUnidade(Guid guid);
    Task<CommandResult> GetUnidadesDisponiveisPorGuidImovel(Guid imovelGuid, string lstUnidadesLocadas);
}