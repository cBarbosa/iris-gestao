using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ContratoFornecedor: BaseEntity<ContratoFornecedor>
{
    public int? IdCliente { get; set; }
    public int IdFornecedor { get; set; }
    public int IdImovel { get; set; }
    public int? IdUnidade { get; set; }
    public int IdFormaPagamento { get; set; }
    public int IdIndiceReajuste { get; set; }
    public int? IdTipoServico { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string NumeroContrato { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string DescricaoServico { get; set; } = null!;

    [Column(TypeName = "decimal(8, 6)")]
    public decimal? Percentual { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataAtualizacao { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal ValorServicoContratado { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataInicioContrato { get; set; }

    public int PrazoTotalMeses { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataFimContrato { get; set; }

    public int DiaPagamento { get; set; }

    public int PeriodicidadeReajuste { get; set; }

    [Unicode(false)]
    public Guid? GuidReferencia { get; set; }

    public bool Status { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [InverseProperty("IdContratoFornecedorNavigation")]
    public virtual ICollection<DespesaProprietario> DespesaProprietario { get; } = new List<DespesaProprietario>();

    [ForeignKey("IdFornecedor")]
    [InverseProperty("ContratoFornecedor")]
    public virtual Fornecedor IdFornecedorNavigation { get; set; } = null!;

    [ForeignKey("IdCliente")]
    [InverseProperty("ContratoFornecedor")]
    public virtual Cliente? IdClienteNavigation { get; set; } = null!;

    [ForeignKey("IdFormaPagamento")]
    [InverseProperty("ContratoFornecedor")]
    public virtual FormaPagamento IdFormaPagamentoNavigation { get; set; } = null!;

    [ForeignKey("IdImovel")]
    [InverseProperty("ContratoFornecedor")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("ContratoFornecedor")]
    public virtual Unidade? IdUnidadeNavigation { get; set; } = null!;

    [ForeignKey("IdIndiceReajuste")]
    [InverseProperty("ContratoFornecedor")]
    public virtual IndiceReajuste IdIndiceReajusteNavigation { get; set; } = null!;

    [ForeignKey("IdTipoServico")]
    [InverseProperty("ContratoFornecedor")]
    public virtual TipoServico? IdTipoServicoNavigation { get; set; } = null!;
}
