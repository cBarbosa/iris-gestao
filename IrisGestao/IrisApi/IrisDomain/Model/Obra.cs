using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisConsole.Model;

public partial class Obra
{
    [Key]
    public int Id { get; set; }

    public int IdImovel { get; set; }

    public int IdOrcamento { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataInicio { get; set; }

    [Column(TypeName = "date")]
    public DateTime? DataPrevistaTermino { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? GuidReferencia { get; set; }

    [ForeignKey("IdImovel")]
    [InverseProperty("Obra")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;

    [ForeignKey("IdOrcamento")]
    [InverseProperty("Obra")]
    public virtual Orcamento IdOrcamentoNavigation { get; set; } = null!;

    [InverseProperty("IdObraNavigation")]
    public virtual ICollection<NotaFiscal> NotaFiscal { get; } = new List<NotaFiscal>();
}
