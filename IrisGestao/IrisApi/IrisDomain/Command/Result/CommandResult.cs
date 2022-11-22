namespace IrisGestao.Domain.Command.Result;

public class CommandResult
{
    public CommandResult(bool success, string message, object data)
    {
        Message = message;
        Success = success;
        Data = data;
    }

    public string Message { get; private set; }
    public bool Success { get; private set; }
    public object Data { get; private set; }
}