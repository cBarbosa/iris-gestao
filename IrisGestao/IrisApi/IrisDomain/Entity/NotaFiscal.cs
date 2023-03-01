using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class NotaFiscal: BaseEntity<NotaFiscal>
{
    public int IdTipoServico { get; set; }

    public int IdObra { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string NumeroNota { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime DataEmissao { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal Valor { get; set; }

    public int PercentualAdministracaoObra { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string GuidReferencia { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [ForeignKey("IdObra")]
    [InverseProperty("NotaFiscal")]
    public virtual Obra IdObraNavigation { get; set; } = null!;

    [ForeignKey("IdTipoServico")]
    [InverseProperty("NotaFiscal")]
    public virtual TipoServico IdTipoServicoNavigation { get; set; } = null!;
}
