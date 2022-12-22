using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarUnidadeCommand
    {
        public Guid GuidReferencia { get; set; }
        public Guid GuidReferenciaImovel { get; set; }
        public int IdTipoUnidade { get; set; }
        public decimal AreaUtil { get; set; }
        public decimal AreaTotal { get; set; }
        public decimal? AreaHabitese { get; set; }
        public string? Matricula { get; set; }
        public string? InscricaoIptu { get; set; }
        public string? MatriculaEnergia { get; set; }
        public string? MatriculaAgua { get; set; }
        public decimal? TaxaAdministracao { get; set; }
        public decimal? ValorPotencial { get; set; }
        public bool UnidadeLocada { get; set; }
    }
}