using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Obra: BaseEntity<Obra>
{
    public int IdImovel { get; set; }

    public int IdOrcamento { get; set; }

    public Guid? GuidReferencia { get; set; }

    [StringLength(100)]
    public string Nome { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataInicio { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataPrevistaTermino { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorOrcamento { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? Percentual { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [ForeignKey("IdImovel")]
    [InverseProperty("Obra")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [ForeignKey("IdOrcamento")]
    [InverseProperty("Obra")]
    public virtual Orcamento IdOrcamentoNavigation { get; set; } = null!;

    [InverseProperty("IdObraNavigation")]
    public virtual ICollection<NotaFiscal> NotaFiscal { get; } = new List<NotaFiscal>();
}
