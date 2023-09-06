using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ObraUnidade: BaseEntity<ObraUnidade>
{
    public int IdObra { get; set; }

    public int IdUnidade { get; set; }

    public DateTime DataCriacao { get; set; }

    [ForeignKey("IdObra")]
    [InverseProperty("ObraUnidade")]
    public virtual Obra IdObraNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("ObraUnidade")]
    public virtual Unidade IdUnidadeNavigation { get; set; } = null!;
}
