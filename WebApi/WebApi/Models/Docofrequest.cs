

namespace WebApi.Models
{
    public class Docofrequest
    {
        public long Id { get; set; }
        public long RegistrasionlistId { get; set; }
        public long DocumentArchiveId { get; set; }
        public System.Int32 BorrowType { get; set; }
        public System.DateTime ReturnFedback { get; set; }
        public System.Int32 AgreeStatus { get; set; }
        public System.String ReceiverName { get; set; }
        public System.DateTime? ReceiveDate { get; set; }
        public System.Int32 ReceiveStatus { get; set; }
        public System.Int32 LenderId { get; set; }
        public System.String ReceiveNote { get; set; }
        public System.String ReimburseName { get; set; }
        public System.DateTime? ReimburseDate { get; set; }
        public System.Int32? ReimburseStatus { get; set; }
        public System.Boolean ReturnStatus { get; set; }
        public System.Int32 ReimburseStaffId { get; set; }
        public System.String ReimburseNote { get; set; }
        public long ReCordId { get; set; }
        public System.String FileNotation { get; set; }
        public System.Int32 DocFileId { get; set; }
        public System.String Version { get; set; }
        public System.DateTime? AppointmentDate { get; set; }
        public System.Int32 UnitId { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.String FullName { get; set; }
        public System.Int32 RegisterUser { get; set; }
        public System.Int32 BrowsingStatus { get; set; }
        public System.Int32 RecipientsName { get; set; }
        public System.Int32 RecordTypeId { get; set; }
        public System.DateTime? ExtendDate { get; set; }






    }
}
