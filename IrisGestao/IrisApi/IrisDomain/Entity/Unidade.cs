using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Unidade: BaseEntity<Unidade>
{
    public int IdImovel { get; set; }

    public int IdTipoUnidade { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Tipo { get; set; } = null!;

    [Column(TypeName = "decimal(18, 0)")]
    public decimal AreaUtil { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal AreaTotal { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? AreaHabitese { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Matricula { get; set; }

    [StringLength(60)]
    [Unicode(false)]
    public string? InscricaoIPTU { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? MatriculaEnergia { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? MatriculaAgua { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? TaxaAdministracao { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? ValorPotencial { get; set; }

    public bool? UnidadeLocada { get; set; }
    public bool Status { get; set; }

    // TODO alterar o tipo para GUID
    [StringLength(50)]
    [Unicode(false)]
    public string GuidReferencia { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [InverseProperty("IdUnidadeNavigation")]
    public virtual ICollection<ContratoAluguel> ContratoAluguel { get; } = new List<ContratoAluguel>();

    [InverseProperty("IdUnidadeNavigation")]
    public virtual ICollection<DespesaLocatario> DespesaLocatario { get; } = new List<DespesaLocatario>();

    [InverseProperty("IdUnidadeNavigation")]
    public virtual ICollection<DespesaProprietario> DespesaProprietario { get; } = new List<DespesaProprietario>();

    [ForeignKey("IdImovel")]
    [InverseProperty("Unidade")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [ForeignKey("IdTipoUnidade")]
    [InverseProperty("Unidade")]
    public virtual TipoUnidade IdTipoUnidadeNavigation { get; set; } = null!;
}
