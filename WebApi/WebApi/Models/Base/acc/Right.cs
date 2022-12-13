namespace WebApi.Models  
{
	public  class Right 
	{
		public System.Int32 Id { get; set; } 
		public System.Int32 ParentId { get; set; } 
		public System.String Name { get; set; } 
		public System.String NameOfMenu { get; set; } 
		public System.String ActionLink { get; set; } 
		public System.Int32 SortOrder { get; set; } 
		public System.String Image { get; set; } 
		public System.Boolean ShowMenu { get; set; } 
		public System.Boolean DefaultPage { get; set; } 
		public System.String Description { get; set; } 
		public System.Boolean IsLocked { get; set; } 
		public System.DateTime CreatedDate { get; set; } 
		public System.Int32 UnitId { get; set; }
	}

}
