using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Unidade: BaseEntity<Unidade>
{
    [Key]
    public int Id { get; set; }

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

    [Column("InscricaoIPTU")]
    [StringLength(60)]
    [Unicode(false)]
    public string? InscricaoIptu { get; set; }

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

    public byte UnidadeLocada { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string GuidReferencia { get; set; } = null!;

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
