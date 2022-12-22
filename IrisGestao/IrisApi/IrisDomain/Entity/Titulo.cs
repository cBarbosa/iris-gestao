using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Titulo: BaseEntity<Titulo>
{
    [StringLength(100)]
    [Unicode(false)]
    public string NumeroTitulo { get; set; } = null!;

    public int IdTipoTitulo { get; set; }

    public int IdImovel { get; set; }

    public byte CreditoLocador { get; set; }

    public byte CreditoAdministrado { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal ValorTitulo { get; set; }

    public int Parcelas { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [InverseProperty("IdTituloNavigation")]
    public virtual ICollection<FaturaTitulo> FaturaTitulo { get; } = new List<FaturaTitulo>();

    [ForeignKey("IdImovel")]
    [InverseProperty("Titulo")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [ForeignKey("IdTipoTitulo")]
    [InverseProperty("Titulo")]
    public virtual TipoTitulo IdTipoTituloNavigation { get; set; } = null!;
}
