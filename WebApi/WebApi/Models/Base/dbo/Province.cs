namespace WebApi.Models  
{
	public  class Province 
	{
		public System.Int32 Id { get; set; } 
		public System.String Code { get; set; } 
		public System.String Name { get; set; } 
		public System.String Desciption { get; set; } 
		public System.Boolean IsLocked { get; set; } 
		public System.Int32? ModifiedUserId { get; set; } 
		public System.DateTime? ModifiedDate { get; set; } 
		public System.Int32 CreatedUserId { get; set; } 
		public System.DateTime CreatedDate { get; set; } 
		public System.Int32? VnPostCode { get; set; } 
	}

}
