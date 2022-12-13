using System.Collections.Generic;

using  WebApi.Models;

namespace WebApi.Models  
{
	public  class RightModel : Right 
	{
		public int TotalRowCount { get; set; }
        public List<ActionModel> ListAction { get;  set; }
        public string StatusText
        {
            get
            {
                var status = "Hoạt động";
                if (IsLocked)
                    status = "Tạm ngừng hoạt động";
                return status;
            }
        }

        public bool IsRightFake { get; set; }
        public System.Boolean Selected { get; set; }
        public System.Boolean PreSelected { get; set; }
        public string ReturnUrl { get; set; }
        public string ParentName { get; set; }
    }

}
