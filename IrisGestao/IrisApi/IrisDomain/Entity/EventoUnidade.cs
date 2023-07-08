using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class EventoUnidade : BaseEntity<EventoUnidade>
{
    public int Id { get; set; }

    public int IdEvento { get; set; }

    public int IdUnidade { get; set; }

    [ForeignKey("IdEvento")]
    [InverseProperty("EventoUnidade")]
    public virtual Evento IdEventoNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("EventoUnidade")]
    public virtual Unidade IdUnidadeNavigation { get; set; } = null!;

}
