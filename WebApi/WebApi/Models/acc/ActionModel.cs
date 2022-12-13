using System.Collections.Generic;

using  WebApi.Models;

namespace WebApi.Models  
{
	public  class ActionModel : Action 
	{
		public int TotalRowCount { get; set; }
        public System.Int32 ParentId { get; set; }
        public System.Boolean Selected { get; set; }
        public System.Int32 SortOrder { get; set; }
        public string GroupRightName { get; set; }
        public string RightName { get; set; }
        public string RightNameOfMenu { get; set; }
        public string RightImage { get; set; }
        public string ActionLink { get; set; }
        public System.Int32 ActionId { get; set; }
        public System.Int32 UnitId { get; set; }
    }

}
