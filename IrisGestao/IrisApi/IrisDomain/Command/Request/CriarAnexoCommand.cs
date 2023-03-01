using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarAnexoCommand
    {
        public int? Id { get; set; }
        public string Nome { get; set; }
        public string Local { get; set; }
        public Guid IdReferencia { get; set; }
        public String MimeType { get; set; }
        public int Tamanho { get; set; }
        public string Classificacao { get; set; }
        public byte[] base64 { get; set; }
        public ICollection<ImageMessage> Images { get; set; }
    }
    
    public class ImageMessage
    {
        public byte[]? ImageBinary { get; set; }
        public string ImageHeaders { get; set; } = string.Empty;
    }
}