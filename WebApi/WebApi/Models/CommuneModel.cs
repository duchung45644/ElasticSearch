using System.Collections.Generic;

using  WebApi.Models;

namespace WebApi.Models  
{
	public  class CommuneModel : Commune 
	{
		public string ProvinceName { set; get; }
		public string DistrictName { set; get; }
		public int TotalRowCount { get; set; } 
	}

}
