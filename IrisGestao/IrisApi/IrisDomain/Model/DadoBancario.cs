using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisConsole.Model;

public partial class DadoBancario
{
    [Key]
    public int Id { get; set; }

    public int Agencia { get; set; }

    public int? Operacao { get; set; }

    public int Conta { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Banco { get; set; } = null!;

    [StringLength(60)]
    [Unicode(false)]
    public string? ChavePix { get; set; }

    [InverseProperty("IdDadoBancarioNavigation")]
    public virtual ICollection<Fornecedor> Fornecedor { get; } = new List<Fornecedor>();
}
