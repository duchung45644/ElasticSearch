using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Request
{
    public class CategoryModel:Category
    {
        public int TotalRowCount { get; set; }
    }
}
