using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class DashboardModel
    {
        public List<DashboardData> DataByFamCates { set; get; }
        public List<DashboardData> Stats { set; get; }
        public List<DashboardData> DataByCategories { set; get; }
        public List<DashboardData> DataLineChart { set; get; }
    }
    public class DashboardData
    {
        public string Name { set; get; }
        public int Value { set; get; }
        public int CountAll { set; get; }
        public int CountNew { set; get; }
    }
}
