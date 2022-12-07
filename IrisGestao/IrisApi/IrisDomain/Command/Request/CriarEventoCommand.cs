using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarEventoCommand
    {
        public int Id { get; set; }
        public int IdImovel { get; set; }
        public int IdTipoEvento { get; set; }
        public int IdCliente { get; set; }
        public string Nome { get; set; }
        public DateTime? DthRealizacao { get; set; }
        public Guid GuidReferencia { get; set; }
    }
}