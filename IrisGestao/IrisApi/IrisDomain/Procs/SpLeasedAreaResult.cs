namespace IrisGestao.Domain.Procs;

public partial class SpLeasedAreaResult
{
    public string? NomeImovel { get; set; }
    public long? NumCentroCusto { get; set; }
    public string? NomeLocador { get; set; }
    public string? NomeLocatario { get; set; }
    public decimal? SomaAreaTotal { get; set; }
    public decimal? SomaAreaUtil { get; set; }
    public decimal? SomaAreaHabitese { get; set; }
    public decimal? SomaValorAluguel { get; set; }
    public decimal? SomaValorPotencial { get; set; }
}
