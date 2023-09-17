namespace IrisGestao.Domain.Command.Request;

public class CriarObraServicoCommand
{
    public Guid?  GuidReferencia { get; set; }
    public string NumeroNota { get; set; }
    public string Descricao { get; set; }
    public decimal? Percentual { get; set; }
    public decimal? ValorOrcado { get; set; }
    public decimal? ValorContratado { get; set; }
    public DateTime? DataVencimento { get; set; }
    public DateTime? DataEmissao { get; set; }
}