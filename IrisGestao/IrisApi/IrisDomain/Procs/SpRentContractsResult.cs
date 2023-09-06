namespace IrisGestao.Domain.Procs;

public partial class SpRentContractsResult
{
    public string? Imovel { get; set; }
    public string? Locatario { get; set; }
    public string? Locador { get; set; }
    public string? PercUltimoReajuste { get; set; }
    public DateTime? InicioContrato { get; set; }
    public DateTime? FimContrato { get; set; }
    public DateTime? ProxReajuste { get; set; }
    public string? PercDesconto { get; set; }
    public int? PrazoDesconto { get; set; }
    public bool? Carencia { get; set; }
    public int? PrazoCarencia { get; set; }
    public string? BaseReajuste { get; set; }
}