using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class NotaFiscal: BaseEntity<NotaFiscal>
{
    public int IdTipoServico { get; set; }

    public int IdObra { get; set; }

    public Guid? GuidReferencia { get; set; }

    [StringLength(70)]
    [Unicode(false)]
    public string NumeroNota { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal ValorServico { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorOrcado { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorContratado { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataEmissao { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataVencimento { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal PercentualAdministracaoObra { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DataCriacao { get; set; }

    [ForeignKey("IdObra")]
    [InverseProperty("NotaFiscal")]
    public virtual Obra IdObraNavigation { get; set; } = null!;

    [ForeignKey("IdTipoServico")]
    [InverseProperty("NotaFiscal")]
    public virtual TipoServico IdTipoServicoNavigation { get; set; } = null!;
}
