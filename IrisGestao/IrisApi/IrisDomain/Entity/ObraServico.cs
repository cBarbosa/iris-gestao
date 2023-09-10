using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ObraServico: BaseEntity<ObraServico>
{
    public int IdObra { get; set; }

    public int IdTipoObraServico { get; set; }

    public Guid GuidReferencia { get; set; }

    [StringLength(70)]
    public string NumeroNota { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal ValorServico { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal PercentualAdministracaoObra { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorOrcado { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorContratado { get; set; }

    public DateTime? DataEmissao { get; set; }

    public DateTime? DataVencimento { get; set; }

    public DateTime DataCriacao { get; set; }

    [ForeignKey("IdObra")]
    [InverseProperty("ObraServico")]
    public virtual Obra IdObraNavigation { get; set; } = null!;

    [ForeignKey("IdTipoObraServico")]
    [InverseProperty("ObraServico")]
    public virtual TipoObraServico IdTipoObraServicoNavigation { get; set; } = null!;
}
