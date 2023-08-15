namespace IrisGestao.Domain.Procs;

public partial class SpDimobResult
{
    public string? Locador { get; set; }
    public string? MesReferencia { get; set; }
    public decimal? ValorAluguel { get; set; }
    public DateTime? VencimentoAluguel { get; set; }
    public DateTime? DataRecebimento { get; set; }
    public decimal? ValorBruto { get; set; }
    public decimal? ValorLiquido { get; set; }
    public decimal? VencimentoPagamento { get; set; }
    public decimal? DataPagamento { get; set; }
}