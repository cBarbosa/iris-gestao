using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class DespesaProprietario: BaseEntity<DespesaProprietario>
{
    public int IdTipoDespesa { get; set; }

    public int IdUnidade { get; set; }

    public int? IdContratoFornecedor { get; set; }

    [StringLength(120)]
    [Unicode(false)]
    public string? Nome { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataReferencia { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? Valor { get; set; }

    [Column(TypeName = "text")]
    public string? Observacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [ForeignKey("IdContratoFornecedor")]
    [InverseProperty("DespesaProprietario")]
    public virtual ContratoFornecedor? IdContratoFornecedorNavigation { get; set; }

    [ForeignKey("IdTipoDespesa")]
    [InverseProperty("DespesaProprietario")]
    public virtual TipoDespesa IdTipoDespesaNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("DespesaProprietario")]
    public virtual Unidade IdUnidadeNavigation { get; set; } = null!;
}
