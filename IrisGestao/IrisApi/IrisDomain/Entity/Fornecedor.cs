using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace IrisGestao.Domain.Entity;

public partial class Fornecedor: BaseEntity<Fornecedor>
{
    public int IdDadoBancario { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Nome { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string RazaoSocial { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string Endereco { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string Bairro { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string Cidade { get; set; } = null!;

    [StringLength(2)]
    [Unicode(false)]
    public string Estado { get; set; } = null!;

    public int Cep { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataCriacao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DataUltimaModificacao { get; set; }

    public bool? Status { get; set; }

    public Guid? GuidReferencia { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? CpfCnpj { get; set; }

    [StringLength(11)]
    [Unicode(false)]
    public string? Telefone { get; set; }

    [StringLength(60)]
    [Unicode(false)]
    public string? Email { get; set; }

    [InverseProperty("IdFornecedorNavigation")]
    public virtual ICollection<Contato> Contato { get; } = new List<Contato>();

    [InverseProperty("IdFornecedorNavigation")]
    public virtual ICollection<ContratoFornecedor> ContratoFornecedor { get; } = new List<ContratoFornecedor>();

    [ForeignKey("IdDadoBancario")]
    [InverseProperty("Fornecedor")]
    public virtual DadoBancario IdDadoBancarioNavigation { get; set; } = null!;
}
