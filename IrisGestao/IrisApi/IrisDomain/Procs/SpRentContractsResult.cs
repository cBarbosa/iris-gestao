namespace IrisGestao.Domain.Procs;

public partial class SpRentContractsResult
{
    public string? Imovel { get; set; }
    public string? Locador { get; set; }
    public string? PrestadorServico { get; set; }
    public DateTime? InicioContrato { get; set; }
    public DateTime? FimContrato { get; set; }
    public decimal? ValorMensal { get; set; }
    public string? BaseReajuste { get; set; }
}