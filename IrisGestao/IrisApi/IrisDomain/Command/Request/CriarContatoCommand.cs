using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarContatoCommand
    {
        public Guid GuidClienteReferencia { get; set; }
        public int? IdFornecedor { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Cargo { get; set; }
        public DateTime? DataNascimento { get; set; }
    }
}