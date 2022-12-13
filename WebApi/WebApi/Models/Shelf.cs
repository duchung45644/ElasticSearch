namespace WebApi.Models
{
    public class Shelf
    {
        public System.Int32 Id { get; set; }
        public System.Int32 WarehouseId { get; set; }
        public System.String Code { get; set; } 
        public System.String ShelfName { get; set; }
      
        public System.String Capacity { get; set; }
        public System.String Tonnage { get; set; }
        public System.String Size { get; set; }
        public System.Int32 SortOrder { get; set; }

        public System.String Description { get; set; }
        public System.Int32 ModifiedUserId { get; set; }
        public System.DateTime ModifiedDate { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public System.Boolean Status { get; set; }
        public System.Int32 ParentId { get; set; }
        public System.Int32 UnitId { get; set; }
       public System.Int32 ShelfTypeId { get; set; }
        public System.Int32 CategoryId { get; set; }
        public System.String CateName { get; set; }

    }
}