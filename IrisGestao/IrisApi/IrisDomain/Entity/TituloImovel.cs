using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TituloImovel : BaseEntity<TituloImovel>
{
    public int Id { get; set; }

    public int? IdTituloReceber { get; set; }
    public int? IdTituloPagar { get; set; }

    public int IdImovel { get; set; }

    [InverseProperty("IdTituloImovelNavigation")]
    public virtual ICollection<TituloUnidade> TituloUnidade { get; } = new List<TituloUnidade>();

    [ForeignKey("IdTituloReceber")]
    [InverseProperty("TituloImovel")]
    public virtual TituloReceber IdTituloReceberNavigation { get; set; } = null!;

    [ForeignKey("IdImovel")]
    [InverseProperty("TituloImovel")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;
}
