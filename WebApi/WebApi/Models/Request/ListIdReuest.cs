using System.Collections.Generic;

namespace WebApi.Models.Request
{
    public class ListIdReuest : BaseRequest
    {
        public List<int> Ids { get; set; }
        public bool IsAction { get; set; }
    }
}
