using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public class TipoCliente: BaseEntity<TipoCliente>
{
    [StringLength(50)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [InverseProperty("IdTipoClienteNavigation")]
    public virtual ICollection<Cliente> Cliente { get; } = new List<Cliente>();
}