using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class UnaffectedChildModel : UnaffectedChild
    {
        public int TotalRowCount { get; set; }
        public string UnaffectedName { get; set; }
    }
}
