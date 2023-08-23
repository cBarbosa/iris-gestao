using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ContratoAluguelHistoricoReajuste : BaseEntity<ContratoAluguelHistoricoReajuste>
{
    public int Id { get; set; }

    public int IdContratoAluguel { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public double ValorAluguelAnterior { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public double ValorAluguelNovo { get; set; }

    [Column(TypeName = "decimal(8, 6)")]
    public double? PercentualReajusteAnterior { get; set; }

    [Column(TypeName = "decimal(8, 6)")]
    public double? PercentualReajusteNovo { get; set; }


    [Column(TypeName = "date")]
    public DateTime? DataReajuste { get; set; }


    [Unicode(false)]
    public Guid? GuidReferencia { get; set; }
    
    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    public string AlteradoPor { get; set; }

    [ForeignKey("IdContratoAluguel")]
    [InverseProperty("ContratoAluguelHistoricoReajuste")]
    public virtual ContratoAluguel IdContratoAluguelNavigation { get; set; } = null!;
}
