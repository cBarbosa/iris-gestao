using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Evento: BaseEntity<Evento>
{
    public int IdImovel { get; set; }

    public int IdTipoEvento { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? DthRealizacao { get; set; }

    [Unicode(false)]
    public Guid? GuidReferencia { get; set; }

    [StringLength(350)]
    [Unicode(false)]
    public string descricao { get; set; } = null!;

    public int IdCliente { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [ForeignKey("IdCliente")]
    [InverseProperty("Evento")]
    public virtual Cliente IdClienteNavigation { get; set; } = null!;

    [ForeignKey("IdImovel")]
    [InverseProperty("Evento")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [ForeignKey("IdTipoEvento")]
    [InverseProperty("Evento")]
    public virtual TipoEvento IdTipoEventoNavigation { get; set; } = null!;

    [InverseProperty("IdEventoNavigation")]
    public virtual ICollection<EventoUnidade> EventoUnidade { get; } = new List<EventoUnidade>();

}
