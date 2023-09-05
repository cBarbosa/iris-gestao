using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TituloReceber : BaseEntity<TituloReceber>
{
    [StringLength(100)]
    [Unicode(false)]
    public string NumeroTitulo { get; set; } = null!;

    public int IdTipoTitulo { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorTitulo { get; set; }

    public int? Parcelas { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    public bool? Status { get; set; }

    public Guid? GuidReferencia { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataFimTitulo { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ValorTotalTitulo { get; set; }

    public int Sequencial { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? NomeTitulo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataVencimentoPrimeraParcela { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? PorcentagemTaxaAdministracao { get; set; }

    public int? IdContratoAluguel { get; set; }

    public int? IdCliente { get; set; }

    public int? IdTipoCreditoAluguel { get; set; }

    public int? IdIndiceReajuste { get; set; }

    public int? IdFormaPagamento { get; set; }

    [InverseProperty("IdTituloNavigation")]
    public virtual ICollection<FaturaTitulo> FaturaTitulo { get; } = new List<FaturaTitulo>();

    [ForeignKey("IdCliente")]
    [InverseProperty("TituloReceber")]
    public virtual Cliente? IdClienteNavigation { get; set; }

    [ForeignKey("IdContratoAluguel")]
    [InverseProperty("TituloReceber")]
    public virtual ContratoAluguel? IdContratoAluguelNavigation { get; set; }

    [ForeignKey("IdFormaPagamento")]
    [InverseProperty("TituloReceber")]
    public virtual FormaPagamento? IdFormaPagamentoNavigation { get; set; }

    [ForeignKey("IdIndiceReajuste")]
    [InverseProperty("TituloReceber")]
    public virtual IndiceReajuste? IdIndiceReajusteNavigation { get; set; }

    [ForeignKey("IdTipoCreditoAluguel")]
    [InverseProperty("TituloReceber")]
    public virtual TipoCreditoAluguel? IdTipoCreditoAluguelNavigation { get; set; }

    [ForeignKey("IdTipoTitulo")]
    [InverseProperty("TituloReceber")]
    public virtual TipoTitulo IdTipoTituloNavigation { get; set; } = null!;

    [InverseProperty("IdTituloReceberNavigation")]
    public virtual ICollection<TituloImovel> TituloImovel { get; } = new List<TituloImovel>();
}
