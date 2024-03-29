﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class ImovelEndereco: BaseEntity<ImovelEndereco>
{
    public int IdImovel { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Rua { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string Complemento { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? Bairro { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Cidade { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string UF { get; set; } = null!;

    public int Cep { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    [ForeignKey("IdImovel")]
    [InverseProperty("ImovelEndereco")]
    public virtual Imovel IdImovelNavigation { get; set; } = null!;
}
