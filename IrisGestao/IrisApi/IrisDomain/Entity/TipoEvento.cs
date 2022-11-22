using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TipoEvento: BaseEntity<TipoEvento>
{
    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoEventoNavigation")]
    public virtual ICollection<Evento> Evento { get; } = new List<Evento>();
}
