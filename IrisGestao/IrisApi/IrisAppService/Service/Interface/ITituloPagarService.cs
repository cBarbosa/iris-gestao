using IrisGestao.Domain.Command.Request;
using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Services.Interface;

public interface ITituloPagarService
{
    Task<CommandResult> GetAllPaging(string? nomeProprietario, int? idTipoTitulo, int limit, int page);
    Task<CommandResult> GetByGuid(Guid guid);
    Task<CommandResult> InsertByContratoAluguel(ContratoAluguel contratoAluguel, List<ContratoAluguelImovelCommand> lstContratoImovel);
    Task<CommandResult> InsertByContratoFornecedor(ContratoFornecedor contratoFornecedor);
    Task<CommandResult> Insert(CriarTituloPagarCommand cmd);
    Task<CommandResult> Update(Guid uuid, CriarTituloPagarCommand cmd);
    Task<CommandResult> AtualizarReajuste(ContratoAluguel contratoAluguel);
    Task<CommandResult> InativarTitulo(ContratoAluguel contratoAluguel);
    Task<CommandResult> GetAllImoveisTitulo();
}