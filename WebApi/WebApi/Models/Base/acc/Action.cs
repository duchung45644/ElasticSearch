namespace WebApi.Models  
{
	public  class Action 
	{
		public System.Int32 Id { get; set; } 
		public System.Int32 RightId { get; set; } 
		public System.String Code { get; set; } 
		public System.String Name { get; set; } 
		public System.String Description { get; set; } 
		public System.Boolean IsLocked { get; set; } 
		public System.DateTime CreatedDate { get; set; } 


	}

}
