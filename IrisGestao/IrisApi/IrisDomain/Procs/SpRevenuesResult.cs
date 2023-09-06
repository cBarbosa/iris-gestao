namespace IrisGestao.Domain.Procs;

public partial class SpRevenuesResult
{
    public DateTime? DataBaixa { get; set; }
    public DateTime? DataVencimento { get; set; }
    public string? Locador { get; set; }
    public string? Locatario { get; set; }
    public string? Classificacao { get; set; }
    public decimal? ValorAPagar { get; set; }
    public decimal? ValorRealPago { get; set; }
    public decimal? Desconto { get; set; }
}