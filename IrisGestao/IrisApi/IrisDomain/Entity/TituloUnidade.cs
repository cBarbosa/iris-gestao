using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TituloUnidade : BaseEntity<TituloUnidade>
{
    public int Id { get; set; }

    public int IdTituloImovel { get; set; }

    public int IdUnidade { get; set; }

    [ForeignKey("IdTituloImovel")]
    [InverseProperty("TituloUnidade")]
    public virtual TituloImovel IdTituloImovelNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("TituloUnidade")]
    public virtual Unidade IdUnidadeNavigation { get; set; } = null!;
}
