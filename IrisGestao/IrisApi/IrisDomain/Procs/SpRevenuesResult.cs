namespace IrisGestao.Domain.Procs;

public partial class SpRevenuesResult
{
    public DateTime? DataBaixa { get; set; }
    public DateTime? DataVencimento { get; set; }
    public decimal? ValorBaixa { get; set; }
    public decimal? ValorDesconto { get; set; }
    public decimal? ValorLiquido { get; set; }
    public string? NomeCliente { get; set; }
    public string? NomeDocumento { get; set; }
    public string? NomeTitulo { get; set; }
}