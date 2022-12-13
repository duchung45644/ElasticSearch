using System.Collections.Generic;

using  WebApi.Models;

namespace WebApi.Models  
{
	public  class PositionModel : Position 
	{
		public int TotalRowCount { get; set; } 
	}

}
