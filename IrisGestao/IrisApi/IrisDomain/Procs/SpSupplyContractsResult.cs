namespace IrisGestao.Domain.Procs;

public partial class SpSupplyContractsResult
{
    public string? NomeImovel { get; set; }
    public string? NomeLocador { get; set; }
    public string? BaseReajuste { get; set; }
    public DateTime? InicioContrato { get; set; }
    public DateTime? FimContrato { get; set; }
    public DateTime? ProximaAtualizacao { get; set; }
}