namespace WebApi.Models
{
    public class UnaffectedChild
    {
        public System.Int32 Id { get; set; }
        public System.Int32 UnaffectedId { get; set; }
        public System.Int32 UnitId { get; set; }
        public System.String Code { get; set; }
        public System.String UnaffectChildName { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public System.Boolean Status { get; set; }
        public System.Boolean IsDeleted { get; set; }
    }
}