namespace IrisGestao.Domain.Procs;

public partial class SpExpensesResult
{
    public DateTime? DataVencimento { get; set; }
    public decimal? Valor { get; set; }
    public decimal? ValorRealPago { get; set; }
    public decimal? ValorTitulo { get; set; }
    public decimal? ValorTotalTitulo { get; set; }
    public string? NomeTitulo { get; set; }
    public string? NomeDocumento { get; set; }
    public string? NomeImovel { get; set; }
}