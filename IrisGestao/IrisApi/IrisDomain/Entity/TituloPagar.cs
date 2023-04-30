using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TituloPagar : BaseEntity<TituloPagar>
{
    [StringLength(100)]
    [Unicode(false)]
    public string NumeroTitulo { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string NomeTitulo { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public int Sequencial { get; set; }

    public int IdTipoTitulo { get; set; }

    public int? IdContratoAluguel { get; set; } = null!;

    public int? IdCliente { get; set; }

    public int? IdTipoCreditoAluguel { get; set; }

    public int? IdIndiceReajuste { get; set; }

    public int? IdFormaPagamento { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public double ValorTitulo { get; set; }

    public int? Parcelas { get; set; }

    public bool Status { get; set; }

    [Unicode(false)]
    public Guid? GuidReferencia { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public double? ValorTotalTitulo { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataFimTitulo { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataVencimentoPrimeraParcela { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public double? PorcentagemTaxaAdministracao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [InverseProperty("IdTituloPagarNavigation")]
    public virtual ICollection<FaturaTituloPagar> FaturaTituloPagar { get; } = new List<FaturaTituloPagar>();

    [ForeignKey("IdTipoTitulo")]
    [InverseProperty("TituloPagar")]
    public virtual TipoTitulo IdTipoTituloNavigation { get; set; } = null!;

    [ForeignKey("IdContratoAluguel")]
    [InverseProperty("TituloPagar")]
    public virtual ContratoAluguel? IdContratoAluguelNavigation { get; set; } = null!;

    [ForeignKey("IdCliente")]
    [InverseProperty("TituloPagar")]
    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    [ForeignKey("IdIndiceReajuste")]
    [InverseProperty("TituloPagar")]
    public virtual IndiceReajuste IdIndiceReajusteNavigation { get; set; } = null!;

    [ForeignKey("IdTipoCreditoAluguel")]
    [InverseProperty("TituloPagar")]
    public virtual TipoCreditoAluguel IdTipoCreditoAluguelNavigation { get; set; } = null!;

    [InverseProperty("IdTituloPagarNavigation")]
    public virtual ICollection<TituloImovel> TituloImovel { get; } = new List<TituloImovel>();

    [ForeignKey("IdFormaPagamento")]
    [InverseProperty("TituloPagar")]
    public virtual FormaPagamento IdFormaPagamentoNavigation { get; set; } = null!;
}
