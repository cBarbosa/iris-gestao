using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TipoObraServico: BaseEntity<TipoObraServico>
{
    [StringLength(10)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoObraServicoNavigation")]
    public virtual ICollection<ObraServico> ObraServico { get; } = new List<ObraServico>();
}
