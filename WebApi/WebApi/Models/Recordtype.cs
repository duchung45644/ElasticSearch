namespace WebApi.Models
{
    public class Recordtype
    {
        public System.Int32 Id { get; set; }
        public System.String Code { get; set; }
        public System.String Name { get; set; }
        public System.Int32 SortOrder { get; set; }
        public System.String Description { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.Int32 ModifiedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    }
}