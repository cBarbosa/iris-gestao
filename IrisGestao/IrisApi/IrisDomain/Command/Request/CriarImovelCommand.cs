using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarImovelCommand
    {
        public int? Id { get; set; }
        public string Nome { get; set; }
        public int IdCategoriaImovel { get; set; }
        public int IdClienteProprietario { get; set; }
        public int NumCentroCusto { get; set; }
        public bool MonoUsuario { get; set; }
        public string? Classificacao { get; set; }
        public string? GuidReferencia { get; set; }
        public DateTime? DataUltimaModificacao { get; set; }
    }
}