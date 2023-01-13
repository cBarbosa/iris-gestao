using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Contato: BaseEntity<Contato>
{
    public int? IdFornecedor { get; set; }

    public int? IdCliente { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [StringLength(60)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string Cargo { get; set; } = null!;

    [StringLength(11)]
    [Unicode(false)]
    public string Telefone { get; set; } = null!;

    [Column(TypeName = "date")]
    public DateTime? DataNascimento { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [Unicode(false)]
    public Guid? GuidReferencia { get; set; }

    [ForeignKey("IdCliente")]
    [InverseProperty("Contato")]
    public virtual Cliente? IdClienteNavigation { get; set; }

    [ForeignKey("IdFornecedor")]
    [InverseProperty("Contato")]
    public virtual Fornecedor? IdFornecedorNavigation { get; set; }

    public bool Status { get; set; }
}
