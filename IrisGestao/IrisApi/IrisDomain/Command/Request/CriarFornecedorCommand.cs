using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarFornecedorCommand
    {
        public int? IdDadosBancarios { get; set; }
        public string CpfCnpj { get; set; }
        public string Nome { get; set; }
        public string RazaoSocial { get; set; }
        public Boolean Status { get; set; }
        public string Endereco { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public int? Cep { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataUltimaModificacao { get; set; }
        public Guid? GuidReferencia { get; set; }
        public CriarContatoCommand? Contato { get; set; }
        public CriarDadosBancarioCommand? DadosBancarios { get; set; }
    }
}