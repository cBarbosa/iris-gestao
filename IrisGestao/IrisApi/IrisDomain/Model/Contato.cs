using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisConsole.Model;

public partial class Contato
{
    [Key]
    public int Id { get; set; }

    public int? IdFornecedor { get; set; }

    public int? IdCliente { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [StringLength(60)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [StringLength(11)]
    [Unicode(false)]
    public string Telefone { get; set; } = null!;

    [ForeignKey("IdCliente")]
    [InverseProperty("Contato")]
    public virtual Cliente? IdClienteNavigation { get; set; }

    [ForeignKey("IdFornecedor")]
    [InverseProperty("Contato")]
    public virtual Fornecedor? IdFornecedorNavigation { get; set; }
}
