namespace WebApi.Models
{
    public class Approve
    {
        public System.Int32 Id { get; set; }
        public System.String Code { get; set; }
        public System.DateTime Ctime { get; set; }
        public System.String Description { get; set; }
        public System.String Name { get; set; }
        public System.String FullName { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public System.DateTime ApproveDate { get; set; }
        public System.Int32 Status { get; set; }
        public System.String Reason { get; set; }
        public System.DateTime RefuseDate { get; set; }
        public System.Int32 StaffId { get; set; }
        public System.Int32 StaffIdRefuse { get; set; }


    }
}