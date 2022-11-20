using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Cliente: BaseEntity<Cliente>
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string RazaoSocial { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string Endereco { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string Bairro { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string Cidade { get; set; } = null!;

    [StringLength(2)]
    [Unicode(false)]
    public string Estado { get; set; } = null!;

    public int Cep { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataNascimento { get; set; }

    public int Nps { get; set; }

    [InverseProperty("IdClienteNavigation")]
    public virtual ICollection<Contato> Contato { get; } = new List<Contato>();

    [InverseProperty("IdClienteNavigation")]
    public virtual ICollection<ContratoAluguel> ContratoAluguel { get; } = new List<ContratoAluguel>();

    [InverseProperty("IdClienteNavigation")]
    public virtual ICollection<ContratoFornecedor> ContratoFornecedor { get; } = new List<ContratoFornecedor>();

    [InverseProperty("IdClienteNavigation")]
    public virtual ICollection<DespesaLocatario> DespesaLocatario { get; } = new List<DespesaLocatario>();

    [InverseProperty("IdClienteNavigation")]
    public virtual ICollection<Evento> Evento { get; } = new List<Evento>();

    [InverseProperty("IdClienteProprietarioNavigation")]
    public virtual ICollection<Imovel> Imovel { get; } = new List<Imovel>();
}
