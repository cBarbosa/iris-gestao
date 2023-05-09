using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class IndiceReajuste: BaseEntity<IndiceReajuste>
{
    [StringLength(50)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    public int? Percentual { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataAtualizacao { get; set; }

    [InverseProperty("IdIndiceReajusteNavigation")]
    public virtual ICollection<ContratoAluguel> ContratoAluguel { get; } = new List<ContratoAluguel>();

    [InverseProperty("IdIndiceReajusteNavigation")]
    public virtual ICollection<TituloReceber> TituloReceber { get; } = new List<TituloReceber>();

    [InverseProperty("IdIndiceReajusteNavigation")]
    public virtual ICollection<TituloPagar> TituloPagar { get; } = new List<TituloPagar>();

    [InverseProperty("IdIndiceReajusteNavigation")]
    public virtual ICollection<ContratoFornecedor> ContratoFornecedor { get; } = new List<ContratoFornecedor>();
}
