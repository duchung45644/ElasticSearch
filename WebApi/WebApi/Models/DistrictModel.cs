using System.Collections.Generic;

using  WebApi.Models;

namespace WebApi.Models  
{
	public  class DistrictModel : District 
	{
        public string ProvinceName { set; get; }
	
		public int TotalRowCount { get; set; } 
	}

}
