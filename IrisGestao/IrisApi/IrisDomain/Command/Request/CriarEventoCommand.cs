using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarEventoCommand
    {
        public Guid GuidImovel { get; set; }
        public int? IdTipoEvento { get; set; }
        public Guid GuidCliente { get; set; }
        public string TipoEvento { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public DateTime? DthRealizacao { get; set; }
        public List<Guid> lstUnidades { get; set; }
    }
}