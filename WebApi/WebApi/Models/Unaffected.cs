namespace WebApi.Models
{
    public class Unaffected
    {
        public System.Int32 Id { get; set; }
        public System.Int32 ParentId { get; set; }
        public System.String Code { get; set; }
        public System.String Name { get; set; }

        public System.String Description { get; set; }
        public System.Boolean IsLocked { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public System.Boolean IsDeleted { get; set; }
        public System.Boolean IsUnit { get; set; }
        public System.Boolean AllowDocBook { get; set; }
        public System.Int32 Level { get; set; }
        public System.Int32 SortOrder { get; set; }
    }
}