namespace IrisGestao.Infraestructure.ExternalServices;

public interface IRepublicaVirtualService
{
    Task<RepublicaVirtualResult> GetCepData(string cep);
}

public class RepublicaVirtualResult
{
    public string resultado { get; set; }
    public string resultado_txt { get; set; }
    public string uf { get; set; }
    public string cidade { get; set; }
    public string bairro { get; set; }
    public string logradouro { get; set; }
    public string tipo_logradouro { get; set; }
}