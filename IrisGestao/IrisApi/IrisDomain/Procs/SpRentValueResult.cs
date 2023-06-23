namespace IrisGestao.Domain.Procs;

public partial class SpRentValueResult
{
    public string? NomeImovel { get; set; }
    public long? NumCentroCusto { get; set; }
    public string? NomeLocador { get; set; }
    public string? NomeLocatario { get; set; }
    public decimal? SomaValorAluguel { get; set; }
    public decimal? SomaValorPotencial { get; set; }
    public decimal? SomaAreaUtil { get; set; }
    public decimal? SomaPrecoM2 { get; set; }
    public decimal? PrecoMesReferencia { get; set; }
}