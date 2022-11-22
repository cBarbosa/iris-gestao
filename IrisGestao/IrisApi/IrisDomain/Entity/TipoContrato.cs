using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TipoContrato: BaseEntity<TipoContrato>
{
    [StringLength(60)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoContratoNavigation")]
    public virtual ICollection<ContratoAluguel> ContratoAluguel { get; } = new List<ContratoAluguel>();
}
