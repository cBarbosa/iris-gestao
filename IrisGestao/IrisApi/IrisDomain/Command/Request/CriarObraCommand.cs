namespace IrisGestao.Domain.Command.Request;

public class CriarObraCommand
{
    public Guid? GuidReferencia { get; set; }
    public Guid? ImovelGuidReference { get; set; }
    public int? IdImovel { get; set; }
    public string Nome { get; set; }
    public DateTime? DataInicio { get; set; }
    public DateTime? DataPrevistaTermino { get; set; }
    public decimal? Percentual { get; set; }
    public decimal? ValorOrcamento { get; set; }
    public IEnumerable<Guid> UnidadeGuidReferences { get; set; }
}