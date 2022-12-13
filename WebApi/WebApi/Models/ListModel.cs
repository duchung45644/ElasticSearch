using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Base.esto;

namespace WebApi.Models
{
    public class ListModel : Registrasionlist
    {
        public int TotalRowCount { get; set; }
        public List<int> ListList { get; set; }
    }
}