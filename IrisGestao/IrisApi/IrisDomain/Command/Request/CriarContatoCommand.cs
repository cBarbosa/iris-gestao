using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarContatoCommand
    {
        public int? idCliente { get; set; }
        public int? idFornecedor { get; set; }
        public Guid? GuidClienteReferencia { get; set; }
        public Guid? GuidFornecedorReferencia { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Cargo { get; set; }
        public DateTime? DataNascimento { get; set; }
    }
}