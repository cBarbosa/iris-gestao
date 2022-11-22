using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class TipoServico: BaseEntity<TipoServico>
{
    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoServicoNavigation")]
    public virtual ICollection<ContratoFornecedor> ContratoFornecedor { get; } = new List<ContratoFornecedor>();

    [InverseProperty("IdTipoServicoNavigation")]
    public virtual ICollection<NotaFiscal> NotaFiscal { get; } = new List<NotaFiscal>();

    [InverseProperty("IdTipoServicoNavigation")]
    public virtual ICollection<Orcamento> Orcamento { get; } = new List<Orcamento>();
}
