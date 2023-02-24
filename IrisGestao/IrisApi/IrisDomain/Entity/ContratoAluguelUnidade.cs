using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ContratoAluguelUnidade : BaseEntity<ContratoAluguelUnidade>
{
    public int Id { get; set; }

    public int IdContratoAluguelImovel { get; set; }

    public int IdUnidade { get; set; }

    [ForeignKey("IdContratoAluguelImovel")]
    [InverseProperty("ContratoAluguelUnidade")]
    public virtual ContratoAluguelImovel IdContratoAluguelImovelNavigation { get; set; } = null!;

    [ForeignKey("IdUnidade")]
    [InverseProperty("ContratoAluguelUnidade")]
    public virtual Unidade IdUnidadeNavigation { get; set; } = null!;
}
