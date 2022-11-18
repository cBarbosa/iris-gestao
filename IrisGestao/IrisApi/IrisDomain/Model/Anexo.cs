using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisConsole.Model;

public partial class Anexo
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [Column(TypeName = "text")]
    public string Local { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string GuidReferencia { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? MineType { get; set; }

    public int? Tamanho { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Classificacao { get; set; }
}
