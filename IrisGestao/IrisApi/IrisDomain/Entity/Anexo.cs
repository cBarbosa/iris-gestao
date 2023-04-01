using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Anexo : BaseEntity<Anexo>
{
    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string Local { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public Guid GuidReferencia { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? MimeType { get; set; }

    public int? Tamanho { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Classificacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }
}
