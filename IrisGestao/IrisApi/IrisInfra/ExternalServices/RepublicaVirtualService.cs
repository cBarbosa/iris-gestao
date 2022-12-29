using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace IrisGestao.Infraestructure.ExternalServices;

public class RepublicaVirtualService: IRepublicaVirtualService
{
    private readonly string ENDPOINT = @"http://cep.republicavirtual.com.br/web_cep.php?cep={0}&formato=json";
    private readonly ILogger<RepublicaVirtualService> logger;
    
    public RepublicaVirtualService(ILogger<RepublicaVirtualService> logger)
    {
        this.logger = logger;
    }
    
    public async Task<RepublicaVirtualResult> GetCepData(string cep)
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(string.Format(ENDPOINT, cep));
        request.Method = "GET";
        request.ContentType = "application/json";
            
        try
        {
            using var response = await request.GetResponseAsync() as HttpWebResponse;
            await using Stream responseStream = response.GetResponseStream();
            using var reader = new StreamReader(responseStream);
            string responseText = await reader.ReadToEndAsync();

            var result = JsonSerializer.Deserialize<RepublicaVirtualResult>(responseText);
            reader.Close();
                
            return result.resultado.Equals("0")
                ? null
                : result;
        }
        catch (WebException wex)
        {
            var resp = new StreamReader(wex.Response.GetResponseStream()).ReadToEnd();
            logger.LogError(resp);
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            return null!;
        }
    }
}

