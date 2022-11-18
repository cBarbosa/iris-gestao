﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisConsole.Model;

public partial class IndiceReajuste
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    public int? Percentual { get; set; }

    [Column(TypeName = "date")]
    public DateTime DataAtualizacao { get; set; }

    [InverseProperty("IdIndiceReajusteNavigation")]
    public virtual ICollection<ContratoAluguel> ContratoAluguel { get; } = new List<ContratoAluguel>();

    [InverseProperty("IdIndiceReajusteNavigation")]
    public virtual ICollection<ContratoFornecedor> ContratoFornecedor { get; } = new List<ContratoFornecedor>();
}
