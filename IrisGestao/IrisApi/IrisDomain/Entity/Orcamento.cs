using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Orcamento: BaseEntity<Orcamento>
{
    public int IdTipoServico { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal ValorEstimado { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal ValorContratado { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? Saldo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [ForeignKey("IdTipoServico")]
    [InverseProperty("Orcamento")]
    public virtual TipoServico IdTipoServicoNavigation { get; set; } = null!;

    [InverseProperty("IdOrcamentoNavigation")]
    public virtual ICollection<Obra> Obra { get; } = new List<Obra>();
}
