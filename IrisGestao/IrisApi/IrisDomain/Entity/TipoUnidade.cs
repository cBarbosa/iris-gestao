using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TipoUnidade: BaseEntity<TipoUnidade>
{
    [StringLength(50)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoUnidadeNavigation")]
    public virtual ICollection<Unidade> Unidade { get; } = new List<Unidade>();
}
