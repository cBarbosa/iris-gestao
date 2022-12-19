using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Imovel: BaseEntity<Imovel>
{
    public int Id { get; set; }
    
    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    public int IdCategoriaImovel { get; set; }

    public int IdClienteProprietario { get; set; }

    public int NumCentroCusto { get; set; }

    [Unicode(false)]
    public bool MonoUsuario { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Classificacao { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? GuidReferencia { get; set; } = null!;

    [Unicode(false)]
    [NotMapped]
    public DateTime DataCriacao { get; set; }

    [Unicode(false)]
    public DateTime? DataUltimaModificacao { get; set; }

    [InverseProperty("IdImovelNavigation")]
    public virtual ICollection<ContratoAluguel> ContratoAluguel { get; } = new List<ContratoAluguel>();

    [InverseProperty("IdImovelNavigation")]
    public virtual ICollection<ContratoFornecedor> ContratoFornecedor { get; } = new List<ContratoFornecedor>();

    [InverseProperty("IdImovelNavigation")]
    public virtual ICollection<Evento> Evento { get; } = new List<Evento>();

    [ForeignKey("IdCategoriaImovel")]
    [InverseProperty("Imovel")]
    public virtual CategoriaImovel CategoriaImovel { get; set; } = null!;

    [ForeignKey("IdClienteProprietario")]
    [InverseProperty("Imovel")]
    public virtual Cliente ClienteProprietario { get; set; } = null!;

    [InverseProperty("IdImovelNavigation")]
    public virtual ICollection<ImovelEndereco> ImovelEndereco { get; } = new List<ImovelEndereco>();

    [InverseProperty("IdImovelNavigation")]
    public virtual ICollection<Obra> Obra { get; } = new List<Obra>();

    [InverseProperty("IdImovelNavigation")]
    public virtual ICollection<Titulo> Titulo { get; } = new List<Titulo>();

    [InverseProperty("IdImovelNavigation")]
    public virtual ICollection<Unidade> Unidade { get; } = new List<Unidade>();
}
