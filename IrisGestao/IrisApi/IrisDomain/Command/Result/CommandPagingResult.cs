namespace IrisGestao.Domain.Command.Result;

public class CommandPagingResult
{
    public CommandPagingResult(IEnumerable<object>? _items, int _totalCount = 0, int _page = 1, int _pageSize = 10)
    {
        Items = _items;
        TotalCount = _totalCount;
        Page = _page;
        PageSize = _pageSize;
    }

    public int? TotalCount { get; private set; }
    public int? Page { get; private set; }
    public int? PageSize { get; private set; }
    public IEnumerable<object>? Items { get; private set; }
}