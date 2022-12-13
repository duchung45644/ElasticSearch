using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class BoxModel : Box
    {
        public int TotalRowCount { get; set; }
        public string BoxTypeName { get; set; }
        public string ShelfName { get; set; }
        public string CateName { get; set; }
        public string ShelfNameBox { get; set; }
        public string ReceiveName { get; set; }
        public string ResponName { get; set; }

    }
}
