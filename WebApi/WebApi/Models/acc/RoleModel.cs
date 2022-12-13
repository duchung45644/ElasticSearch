using System.Collections.Generic;

using  WebApi.Models;

namespace WebApi.Models  
{
	public  class RoleModel : Role 
	{
		public int TotalRowCount { get; set; } 
		public bool Selected { set; get; }
        public string StatusText
        {
            get
            {
                var status = "Hoạt động";
                if (IsLocked)
                    status = "Không hoạt động";
                return status;
            }
        }
        public List<int> InsertedActions { get; set; }

    }

}
