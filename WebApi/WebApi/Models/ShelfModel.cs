using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class ShelfModel : Shelf
    {
        public int TotalRowCount { get; set; }
      
        public string ShelfTypeName { get; set; }
        public string WarehouseName { get; set; }
        public string CateName { get; set; }
        public string ShelfName { get; set; }
      
    }


}

