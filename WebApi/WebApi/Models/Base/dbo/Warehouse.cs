namespace WebApi.Models
{
	public class Warehouse
	{
		public System.Int32 Id { get; set; }
		public System.Int32 UnitId { get; set; }

		public System.Int32 TypeId { get; set; }
		public System.String Code { get; set; }
		public System.String Name { get; set; }
		public System.String PhoneNumber { get; set; }
		public System.String Address { get; set; }
		public System.Boolean Status { get; set; }
		public System.String Description { get; set; }
		public System.Int32 ModifiedUserId { get; set; }
		public System.DateTime ModifiedDate { get; set; }
		public System.Int32 CreatedUserId { get; set; }
		public System.DateTime CreatedDate { get; set; }
		public System.Boolean IsDeleted { get; set; }
		public System.Boolean IsUnit { get; set; }
		public System.Int32? ParentId { get; set; }

		public System.Int32 LimitChild { get; set; }
		public System.Int32 ContentTotal { get; set; }
		public System.Int32 SortOrder { get; set; }
		public System.Boolean AllowDocBook { get; set; }
		public System.Int32 CategoryId { get; set; }
		public System.String CateName { get; set; }
		public System.Int32 Level { get; set; }
		

	}
}