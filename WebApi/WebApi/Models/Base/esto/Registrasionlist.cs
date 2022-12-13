using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.esto
{
    public class Registrasionlist
    {

        public System.Int64 Id { get; set; }
        public System.String Name { get; set; }
        public System.Int32 UnitId { get; set; }
        public System.Int32 Emergency { get; set; }
        public System.String Notice { get; set; }
        public System.Int32 RequestType { get; set; }
        public System.String UserRequest { get; set; }
        public System.String IdCardUserRequest { get; set; }
        public System.Int32 FondId { get; set; }
        public System.String Referral { get; set; }
        public System.DateTime? BorrowDate { get; set; }
        public System.DateTime? AppointmentDate { get; set; }
        public System.DateTime? ExtendDate { get; set; }
        public System.String ExtendDateStr { get; set; }
        public System.Int32 ModifiedUserId { get; set; }
        public System.DateTime? ModifiedDate { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.DateTime? CreatedDate { get; set; }
        public System.Int32 Status { get; set; }
        public System.String DecisionFile { get; set; }
        public System.String SendingPlace { get; set; }
        public System.String CardId { get; set; }
        public System.String Votes { get; set; }
        public System.String FileCode { get; set; }
        public System.String FullName { get; set; }
        public System.Int64 RecordId { get; set; }
        public System.String FondName { get; set; }
        public System.String Title { get; set; }
        public System.String DocCode { get; set; }
        public System.String Abstract { get; set; }
        public System.Int32 AgreeStatus { get; set; }
        public System.Int64 RegistrasionlistId { get; set; }
        public System.Int64 DocumentArchiveId { get; set; }
        public System.Int32 RegisterUser { get; set; }
        public System.String ReceiverName { get; set; }
        public System.DateTime? ReceiveDate { get; set; }
        public System.Int32 ReceiveStatus { get; set; }
        public System.Int32 LenderId { get; set; }
        public System.String ReceiveNote { get; set; }
        public Int32 IsDocumentOriginal { get; set; }
        public Int32 BrowsingStatus { get; set; }
        public System.String ReimburseName { get; set; }
        public System.DateTime? ReimburseDate { get; set; }
        public System.Int32 ReimburseStatus { get; set; }
        public System.Int32 ReimburseStaffId { get; set; }
        public System.String ReimburseNote { get; set; }
        public System.Int32 RecipientsName { get; set; }
        public System.String ConditionName { get; set; }
        public System.String FullReimburseName { get; set; }
        public System.String ReceiverFullName { get; set; }
        public System.String FilePath { get; set; }
        public System.Int32 ApprovedUser { get; set; }
        public System.DateTime? ApprovedDate { get; set; }
        public System.Int32 ExtensionRequest { get; set; }
        public System.DateTime? ReturnDateHistory { get; set; }
        public System.Int32? ReturnStatusHistory { get; set; }
        public System.DateTime? ExtendDateRecord { get; set; }
        public System.Int64? HistoryId { get; set; }


    }
}
