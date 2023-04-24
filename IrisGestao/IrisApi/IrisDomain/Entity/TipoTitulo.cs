using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TipoTitulo : BaseEntity<TipoTitulo>
{
    [StringLength(50)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoTituloNavigation")]
    public virtual ICollection<TituloReceber> TituloReceber { get; } = new List<TituloReceber>();

    [InverseProperty("IdTipoTituloNavigation")]
    public virtual ICollection<TituloPagar> TituloPagar { get; } = new List<TituloPagar>();
}
