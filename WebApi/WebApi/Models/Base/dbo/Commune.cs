namespace WebApi.Models  
{
	public  class Commune 
	{
		public System.Int32 Id { get; set; } 
		public System.Int32 ProvinceId { get; set; } 
		public System.Int32 DistrictId { get; set; } 
		public System.String Code { get; set; } 
		public System.String Name { get; set; } 
		public System.String Desciption { get; set; } 
		public System.Boolean IsLocked { get; set; } 
		public System.Int32? ModifiedUserId { get; set; } 
		public System.DateTime? ModifiedDate { get; set; } 
		public System.Int32 CreatedUserId { get; set; } 
		public System.DateTime CreatedDate { get; set; } 
	}

}
