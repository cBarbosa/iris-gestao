using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class DespesaLocatario: BaseEntity<DespesaLocatario>
{
    public int IdTipoDespesa { get; set; }

    public int IdUnidade { get; set; }

    public int? IdCliente { get; set; }

    [StringLength(120)]
    [Unicode(false)]
    public string? Nome { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataReferencia { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataPagamento { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataBaixa { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? Valor { get; set; }

    public bool? FaturaBaixada { get; set; }

    [Column(TypeName = "text")]
    public string? Observacao { get; set; }

    [ForeignKey("IdCliente")]
    [InverseProperty("DespesaLocatario")]
    public virtual Cliente? IdClienteNavigation { get; set; }

    [ForeignKey("IdTipoDespesa")]
    [InverseProperty("DespesaLocatario")]
    public virtual TipoDespesa IdTipoDespesaNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("DespesaLocatario")]
    public virtual Unidade IdUnidadeNavigation { get; set; } = null!;
}
