using System.Collections.Generic;

using WebApi.Models;

namespace WebApi.Models
{
    public class CatalogModel : Catalog
    {
        public int TotalRowCount { get; set; }
    }
}
