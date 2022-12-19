using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class CategoriaImovel: BaseEntity<CategoriaImovel>
{
    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("CategoriaImovel")]
    public virtual ICollection<Imovel> Imovel { get; } = new List<Imovel>();
}
