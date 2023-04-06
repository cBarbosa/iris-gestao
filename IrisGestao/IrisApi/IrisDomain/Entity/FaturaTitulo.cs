using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class FaturaTitulo : BaseEntity<FaturaTitulo>
{
    public int IdTitulo { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string NumeroFatura { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public double? Valor { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataEnvio { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataPagamento { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataVencimento { get; set; }

    public int? DiasAtraso { get; set; }

    public bool Status { get; set; }

    public string? StatusFatura { get; set; }

    [Unicode(false)]
    public Guid? GuidReferencia { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public double? ValorRealPago { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? NumeroNotaFiscal { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataEmissaoNotaFiscal { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public double? PorcentagemImpostoRetido { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public double? ValorLiquidoTaxaAdministracao { get; set; }

    [StringLength(1000)]
    public string? DescricaoBaixaFatura { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    public int NumeroParcela { get; set; }

    [ForeignKey("IdTitulo")]
    [InverseProperty("FaturaTitulo")]
    public virtual TituloReceber IdTituloReceberNavigation { get; set; } = null!;
}
