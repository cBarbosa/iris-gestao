using System;
using System.Collections.Generic;
using System.IO.Pipes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class BaixaDeFaturaCommand
    {
        public int? numeroFatura { get; set; }
        public Guid? GuidFatura { get; set; }
        public string? NumeroNotaFiscal { get; set; }
        public DateTime? DataEmissaoNotaFiscal { get; set; }
        public DateTime? DataVencimento { get; set; }
        public DateTime? DataPagamento { get; set; }
        public decimal? Valor { get; set; }
        public decimal? ValorRealPago { get; set; }
        public string? DescricaoBaixaFatura { get; set; }
    }
}