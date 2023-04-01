using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class ContratoAluguelHistoricoReajusteCommand
    {
        public int IdContratoAluguel { get; set; }
        public Guid? GuidContratoAluguel { get; set; }
        public double PercentualReajusteAntigo { get; set; }
        public double PercentualReajusteNovo { get; set; }
        public double ValorAluguelAnterior { get; set; }
        public double ValorAluguelNovo { get; set; }
        public string AlteradoPor { get; set; }
    }
}