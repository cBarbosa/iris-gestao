namespace IrisGestao.Domain.Procs;

public partial class SpRevenuesResult
{
    public DateTime? DataBaixa { get; set; }
    public DateTime? DataVencimento { get; set; }
    public string? NomeCliente { get; set; }
    public string? NomeTitulo { get; set; }
    public decimal? ValorLiquido { get; set; }
    public decimal? ValorBaixa { get; set; }
    public decimal? ValorTitulo { get; set; }
    public decimal? ValorTotalTitulo { get; set; }
    public decimal? ValorDesconto { get; set; }
}