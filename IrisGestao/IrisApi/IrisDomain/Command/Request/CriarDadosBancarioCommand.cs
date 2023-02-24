using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarDadosBancarioCommand
    {
        public int? Id { get; set; }
        public Guid? GuidReferencia { get; set; }
        public int Agencia { get; set; }
        public int Operacao { get; set; }
        public int Conta { get; set; }
        public int? IdBanco { get; set; }
        public string ChavePix { get; set; }
        public string Banco => "Transit";
    }
}