using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ContratoAluguel: BaseEntity<ContratoAluguel>
{
    public int IdCliente { get; set; }

    public int IdImovel { get; set; }

    public int IdTipoCreditoAluguel { get; set; }

    public int IdIndiceReajuste { get; set; }

    public int IdTipoContrato { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string NumeroContrato { get; set; } = null!;

    [Column(TypeName = "decimal(18, 0)")]
    public decimal ValorAluguel { get; set; }

    [Column(TypeName = "decimal(3, 0)")]
    public decimal PercentualRetencaoImpostos { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal ValorAluguelLiquido { get; set; }

    public int? PercentualDescontoAluguel { get; set; }

    public byte CarenciaAluguel { get; set; }

    public int? PrazoCarencia { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataInicioContrato { get; set; }

    public int PrazoTotalContrato { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataFimContrato { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataOcupacao { get; set; }

    public int DiaVencimentoAluguel { get; set; }

    public int PeriodicidadeReajuste { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string GuidReferencia { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    public int IdUnidade { get; set; }

    [ForeignKey("IdCliente")]
    [InverseProperty("ContratoAluguel")]
    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    [ForeignKey("IdImovel")]
    [InverseProperty("ContratoAluguel")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [ForeignKey("IdIndiceReajuste")]
    [InverseProperty("ContratoAluguel")]
    public virtual IndiceReajuste IdIndiceReajusteNavigation { get; set; } = null!;

    [ForeignKey("IdTipoContrato")]
    [InverseProperty("ContratoAluguel")]
    public virtual TipoContrato IdTipoContratoNavigation { get; set; } = null!;

    [ForeignKey("IdTipoCreditoAluguel")]
    [InverseProperty("ContratoAluguel")]
    public virtual TipoCreditoAluguel IdTipoCreditoAluguelNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("ContratoAluguel")]
    public virtual Unidade IdUnidadeNavigation { get; set; } = null!;
}
