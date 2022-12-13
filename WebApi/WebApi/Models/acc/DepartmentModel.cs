using System.Collections.Generic;

using  WebApi.Models;

namespace WebApi.Models  
{
	public  class DepartmentModel : Department 
	{
		public int TotalRowCount { get; set; }
		public List<int> InsertedActions { get;  set; }
    }

}
