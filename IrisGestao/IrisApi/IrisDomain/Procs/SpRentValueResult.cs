namespace IrisGestao.Domain.Procs;

public partial class SpRentValueResult
{
    public string? Imovel { get; set; }
    public long? CentroDeCusto { get; set; }
    public string? Locador { get; set; }
    public string? Locatario { get; set; }
    public decimal? AreaTotalSelecionada { get; set; }
    public decimal? ValorPotencial { get; set; }
    public decimal? PrecoM2 { get; set; }
    public decimal? PrecoM2Referencia { get; set; }
    public decimal? PrecoM2ReferenciaJan { get; set; }
}