using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TipoCliente : BaseEntity<TipoCliente>
{
    [StringLength(50)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoClienteNavigation")]
    public virtual ICollection<Cliente> Titulo { get; } = new List<Cliente>();
}
