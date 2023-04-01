using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITituloReceberService
{
    Task<CommandResult> GetAllPaging(string? numeroTitulo, int? idTipoTitulo, int limit, int page);
    Task<CommandResult> GetByGuid(Guid guid);
    Task<CommandResult> InsertByContratoAluguel(ContratoAluguel contratoAluguel, List<ContratoAluguelImovelCommand> lstContratoImovel);
    Task<CommandResult> Insert(CriarTituloReceberCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarTituloReceberCommand cmd);
    Task<CommandResult> AtualizarReajuste(ContratoAluguel contratoAluguel);
}