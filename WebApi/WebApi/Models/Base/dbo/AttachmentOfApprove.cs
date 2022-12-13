namespace WebApi.Models
{
    public class AttachmentOfApprove
    {
        public System.Int32 Id { get; set; }
        public System.Int32 ApproveAttId { get; set; }
        public System.String FileName { get; set; }
        public System.String FilePath { get; set; }
        public System.String FileSize { get; set; }
        public System.String Extension { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
    }
}