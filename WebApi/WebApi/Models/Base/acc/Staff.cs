namespace WebApi.Models  
{
	public  class Staff 
	{
		public System.Int32 Id { get; set; } 
		public System.Int32 DepartmentId { get; set; } 
		public System.Int32? PositionId { get; set; } 
		public System.Int32 UnitId { get; set; } 
		public System.String Code { get; set; } 
		public System.String FirstName { get; set; } 
		public System.String LastName { get; set; } 
		public System.Byte Gender { get; set; } 
		public System.String UserName { get; set; } 
		public System.String Password { get; set; } 
		public System.String Email { get; set; } 
		public System.String Phone { get; set; } 
		public System.String Mobile { get; set; } 
		public System.DateTime? BirthOfDay { get; set; } 
		public System.String Address { get; set; } 
		public System.String DossierReturnAddress { get; set; } 
		public System.String Image { get; set; } 
		public System.String IDCard { get; set; } 
		public System.DateTime? IDCardDate { get; set; } 
		public System.String IDCardPlace { get; set; } 
		public System.String DepartmentNameReceive { get; set; } 
		public System.String PhoneOfDepartmentReceive { get; set; } 
		public System.Boolean PasswordChanged { get; set; } 
		public System.Boolean IsAdministrator { get; set; } 
		public System.Int32 PlaceOfReception { get; set; } 
		public System.DateTime LastLoginDate { get; set; } 
		public System.Boolean IsLocked { get; set; } 
		public System.Boolean IsDeleted { get; set; } 
		public System.Int32? ModifiedUserId { get; set; } 
		public System.DateTime? ModifiedDate { get; set; } 
		public System.Int32 CreatedUserId { get; set; } 
		public System.DateTime CreatedDate { get; set; } 
		public System.String Token { get; set; } 
		public System.String UnitResolveInformation { get; set; } 
		public System.Boolean IsShowAllDocument { get; set; } 
		public System.Boolean? IsRepresentUnit { get; set; } 
		public System.Boolean? IsRepresentDepartment { get; set; } 
		public System.Int32? CommuneId { get; set; } 
		public System.String SignImage { get; set; } 
		public System.String SignPhone { get; set; } 
	}

}
