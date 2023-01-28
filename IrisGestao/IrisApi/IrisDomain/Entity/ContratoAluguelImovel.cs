using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ContratoAluguelImovel : BaseEntity<ContratoAluguelImovel>
{
    public int Id { get; set; }

    public int IdContratoAluguel { get; set; }

    public int IdImovel { get; set; }

    [InverseProperty("IdContratoAluguelImovelNavigation")]
    public virtual ICollection<ContratoAluguelUnidade> ContratoAluguelUnidade { get; } = new List<ContratoAluguelUnidade>();

    [ForeignKey("IdContratoAluguel")]
    [InverseProperty("ContratoAluguelImovel")]
    public virtual ContratoAluguel IdContratoAluguelNavigation { get; set; } = null!;

    [ForeignKey("IdImovel")]
    [InverseProperty("ContratoAluguelImovel")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;
}
