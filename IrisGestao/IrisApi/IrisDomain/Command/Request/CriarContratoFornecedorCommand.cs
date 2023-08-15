using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarContratoFornecedorCommand
    {
        public Guid? GuidReferencia { get; set; }
        public Guid? GuidCliente { get; set; }
        public Guid? GuidImovel { get; set; }
        public int? idImovel { get; set; }
        public Guid? GuidFornecedor { get; set; }
        public int IdFormaPagamento { get; set; }
        public int IdIndiceReajuste { get; set; }
        public int? IdTipoServico { get; set; }
        public string NumeroContrato { get; set; } = null!;
        public string? DescricaoDoServico { get; set; } = null!;
        public double? Percentual { get; set; }
        public DateTime DataAtualizacao { get; set; }
        public double ValorServicoContratado { get; set; }
        public DateTime DataInicioContrato { get; set; }
        //public int PrazoTotalMeses { get; set; }
        public DateTime DataFimContrato { get; set; }
        public int? DiaPagamento { get; set; }
        public DateTime? DataVencimentoPrimeraParcela { get; set; }
        public int PeriodicidadeReajuste { get; set; }
        public bool Status { get; set; }
    }
}