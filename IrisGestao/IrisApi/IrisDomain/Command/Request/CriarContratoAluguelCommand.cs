using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarContratoAluguelCommand
    {
        public Guid GuidReferencia { get; set; }
        public Guid GuidCliente { get; set; }
        public int IdTipoCreditoAluguel { get; set; }
        public int IdIndiceReajuste { get; set; }
        public int IdTipoContrato { get; set; }
        public string NumeroContrato { get; set; } = null!;
        public double ValorAluguel { get; set; }
        public double PercentualRetencaoImpostos { get; set; }
        public double ValorAluguelLiquido { get; set; }
        public double? PercentualDescontoAluguel { get; set; }

        public int? PrazoDesconto { get; set; }
        public bool CarenciaAluguel { get; set; }
        public int? PrazoCarencia { get; set; }
        public DateTime DataInicioContrato { get; set; }
        public DateTime? DataVencimentoPrimeraParcela { get; set; }
        public int PrazoTotalContrato { get; set; }
        public DateTime? DataOcupacao { get; set; }
        public int DiaVencimentoAluguel { get; set; }
        public int PeriodicidadeReajuste { get; set; }
        public bool Status { get; set; }
        public List<ContratoAluguelImovelCommand> lstImoveis { get; set; }
    }

    public class ContratoAluguelImovelCommand
    {
        public Guid guidImovel { get; set; }
        public List<Guid> lstUnidades { get; set; }
    }
}