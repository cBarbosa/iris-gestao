using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarTituloPagarCommand
    {
        public int? Id { get; set; }
        //public int? idTituloReceber { get; set; }
        //public string NumeroTitulo { get; set; }
        public string NomeTitulo { get; set; }
        public int IdTipoTitulo { get; set; }
        public int IdTipoCreditoAluguel { get; set; }
        public Guid GuidCliente { get; set; }
        public Guid? IdContratoAluguel { get; set; }
        public int? IdIndiceReajuste { get; set; }
        public int? IdFormaPagamento { get; set; }
        public DateTime DataVencimentoPrimeraParcela { get; set; }
        public DateTime dataFimTitulo { get; set; }
        public double ValorTitulo { get; set; }
        public double PorcentagemImpostoRetido { get; set; }
        public int Parcelas { get; set; }
        public Guid GuidReferencia { get; set; }
        public List<TituloPagarImovelCommand> lstImoveis { get; set; }
    }

    public class TituloPagarImovelCommand
    {
        public Guid guidImovel { get; set; }
        public List<Guid> lstUnidades { get; set; }
    }
}