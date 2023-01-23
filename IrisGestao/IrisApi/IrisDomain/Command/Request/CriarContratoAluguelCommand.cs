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
        public decimal ValorAluguel { get; set; }
        public decimal PercentualRetencaoImpostos { get; set; }
        public decimal ValorAluguelLiquido { get; set; }
        public int? PercentualDescontoAluguel { get; set; }
        public bool CarenciaAluguel { get; set; }
        public int? PrazoCarencia { get; set; }
        public DateTime DataInicioContrato { get; set; }
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