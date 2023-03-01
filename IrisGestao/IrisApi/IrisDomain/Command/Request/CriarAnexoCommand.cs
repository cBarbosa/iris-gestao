using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Command.Request
{
    public class CriarAnexoCommand
    {
        public Guid IdReferencia { get; set; }
        public string Classificacao { get; set; }
        public ICollection<ImageMessage> Images { get; set; }
    }
    
    public class ImageMessage
    {
        public byte[]? ImageBinary { get; set; } = null!;
        public string ImageHeaders { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public int? ImageSize { get; set; } = null!;
        public string? ImageName { get; set; } = null!;
    }
}