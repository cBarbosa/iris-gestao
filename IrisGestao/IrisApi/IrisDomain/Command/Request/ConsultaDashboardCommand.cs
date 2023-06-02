namespace IrisGestao.Domain.Command.Request;

public class ConsultaDashboardCommand
{
    public int? IdLocador { get; set; }
    public int? IdTipoImovel { get; set; }
    public DateTime? DateRefInit { get; set; }
    public DateTime? DateRefEnd { get; set; }
}