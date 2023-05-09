using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class FaturaTituloPagarCommand
    {
        public double? Valor { get; set; }
        public double? ValorRealPago { get; set; }
        public DateTime? DataPagamento { get; set; }
        public DateTime? DataVencimento { get; set; }
        public string? NumeroNotaFiscal { get; set; }
        public DateTime? DataEmissaoNotaFiscal { get; set; }
        public DateTime? DataEnvio { get; set; }
        public double? PorcentagemImpostoRetido { get; set; }
        public double? ValorLiquidoTaxaAdministracao { get; set; }
        public string? DescricaoBaixaFatura { get; set; }
    }

    public class BaixarFaturaTituloPagarCommand
    {
        public DateTime DataPagamento { get; set; }
        public double ValorRealPago { get; set; }
        public string DescricaoBaixaFatura { get; set; }
    }
}