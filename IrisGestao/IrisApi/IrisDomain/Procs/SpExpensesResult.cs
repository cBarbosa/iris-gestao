namespace IrisGestao.Domain.Procs;

public partial class SpExpensesResult
{
    public DateTime? DataVencimento { get; set; }
    public decimal? Valor { get; set; }
    public decimal? ValorRealPago { get; set; }
    public string? Locador { get; set; }
    public string? TipoTitulo { get; set; }
    public decimal? ValorTitulo { get; set; }
    public decimal? ValorTotalTitulo { get; set; }
}