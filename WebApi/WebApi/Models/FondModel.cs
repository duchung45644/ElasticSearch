using WebApi.Models.Base.esto;

namespace WebApi.Models.Request
{
    public class FondModel : Fond
    {
        public int TotalRowCount { get; set; }
        public string Name { get; set; }
        public string DepartmentName { get; set; }
       
    }
}