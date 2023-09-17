using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Obra: BaseEntity<Obra>
{
    public int IdImovel { get; set; }

    public Guid? GuidReferencia { get; set; }

    [StringLength(100)]
    public string? Nome { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataInicio { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataPrevistaTermino { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorOrcamento { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? Percentual { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DataCriacao { get; set; }

    [ForeignKey("IdImovel")]
    [InverseProperty("Obra")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [InverseProperty("IdObraNavigation")]
    public virtual ICollection<ObraServico> ObraServico { get; } = new List<ObraServico>();

    [InverseProperty("IdObraNavigation")]
    public virtual ICollection<ObraUnidade> ObraUnidade { get; } = new List<ObraUnidade>();
}
