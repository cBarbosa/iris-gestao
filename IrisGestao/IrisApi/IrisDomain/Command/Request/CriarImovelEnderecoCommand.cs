using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarImovelEnderecoCommand
    {
        public int? Id { get; set; }
        public int idImovel { get; set; }
        public string? Rua { get; set; }
        public string? Complemento { get; set; }
        public string? Bairro{ get; set; }
        public string? Cidade { get; set; }
        public string? UF { get; set; }
        public int Cep { get; set; }
        public DateTime? DataUltimaModificacao { get; set; }
    }
}