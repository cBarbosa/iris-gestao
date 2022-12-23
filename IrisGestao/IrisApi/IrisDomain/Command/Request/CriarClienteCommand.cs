using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarClienteCommand
    {
        public int? Id { get; set; }
        public int? IdTipoCliente { get; set; }
        public string CpfCnpj { get; set; }
        public string Nome { get; set; }
        public string RazaoSocial { get; set; }
        public Boolean Status { get; set; }
        public string Endereco { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public int? Cep { get; set; }
        public DateTime? DataNascimento { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public int Nps { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataUltimaModificacao { get; set; }
        public string? GuidReferencia { get; set; }
    }
}