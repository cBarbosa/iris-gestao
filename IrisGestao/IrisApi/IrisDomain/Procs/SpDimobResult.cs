namespace IrisGestao.Domain.Procs;

public partial class SpDimobResult
{
    public string? Competencia { get; set; }
    public string? Contrato { get; set; }
    public DateTime? DtContrato { get; set; }
    public string? Locador { get; set; }
    public string? Locatario { get; set; }
    public string? Endereco { get; set; }
    public decimal? RendimentoBruto { get; set; }
    public decimal? ValorComissao { get; set; }
}