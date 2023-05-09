using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class DadoBancario: BaseEntity<DadoBancario>
{
    public int? IdBanco { get; set; }

    public int Agencia { get; set; }

    public int? Operacao { get; set; }

    public int Conta { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Banco { get; set; } = null!;

    [StringLength(60)]
    [Unicode(false)]
    public string? ChavePix { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    public Guid? GuidReferencia { get; set; }

    [InverseProperty("IdDadoBancarioNavigation")]
    public virtual ICollection<Fornecedor> Fornecedor { get; } = new List<Fornecedor>();

    [ForeignKey("IdBanco")]
    [InverseProperty("DadoBancario")]
    public virtual Bancos? IdBancoNavigation { get; set; }
}
