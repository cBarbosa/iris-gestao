using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ContratoAluguel: BaseEntity<ContratoAluguel>
{
    public int IdCliente { get; set; }

    public int IdTipoCreditoAluguel { get; set; }

    public int IdIndiceReajuste { get; set; }

    public int IdTipoContrato { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string NumeroContrato { get; set; } = null!;

    [Column(TypeName = "decimal(18, 0)")]
    public double ValorAluguel { get; set; }

    [Column(TypeName = "decimal(3, 0)")]
    public double PercentualRetencaoImpostos { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public double ValorAluguelLiquido { get; set; }

    [Column(TypeName = "decimal(3, 0)")]
    public double? PercentualDescontoAluguel { get; set; }

    public bool CarenciaAluguel { get; set; }

    public int? PrazoCarencia { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataInicioContrato { get; set; }

    public int PrazoTotalContrato { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataFimContrato { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataOcupacao { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataVencimentoPrimeraParcela { get; set; }

    public int DiaVencimentoAluguel { get; set; }

    public int PeriodicidadeReajuste { get; set; }
    public bool Status { get; set; }

    [Unicode(false)]
    public Guid? GuidReferencia { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [InverseProperty("IdContratoAluguelNavigation")]
    public virtual ICollection<ContratoAluguelHistoricoReajuste> ContratoAluguelHistoricoReajuste { get; } = new List<ContratoAluguelHistoricoReajuste>();

    [InverseProperty("IdContratoAluguelNavigation")]
    public virtual ICollection<ContratoAluguelImovel> ContratoAluguelImovel { get; } = new List<ContratoAluguelImovel>();

    [ForeignKey("IdCliente")]
    [InverseProperty("ContratoAluguel")]
    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    [ForeignKey("IdIndiceReajuste")]
    [InverseProperty("ContratoAluguel")]
    public virtual IndiceReajuste IdIndiceReajusteNavigation { get; set; } = null!;

    [ForeignKey("IdTipoContrato")]
    [InverseProperty("ContratoAluguel")]
    public virtual TipoContrato IdTipoContratoNavigation { get; set; } = null!;

    [ForeignKey("IdTipoCreditoAluguel")]
    [InverseProperty("ContratoAluguel")]
    public virtual TipoCreditoAluguel IdTipoCreditoAluguelNavigation { get; set; } = null!;

    [InverseProperty("IdContratoAluguelNavigation")]
    public virtual ICollection<TituloReceber> TituloReceber { get; } = new List<TituloReceber>();
}
