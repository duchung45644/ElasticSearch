using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.esto
{
    public class Docofrequest
    {
        public System.Int64 Id { get; set; }
        public System.Int64 RegistrasionlistId { get; set; }
        public System.Int64 DocumentArchiveId { get; set; }
        public System.Int32 BorrowType { get; set; }
        public System.DateTime ReturnFedback { get; set; }
        public System.Int32 AgreeStatus { get; set; }
        public System.String ReceiverName { get; set; }
        public System.DateTime ReceiveDate { get; set; }
        public System.Int32 ReceiveStatus { get; set; }
        public System.Int32 LenderId { get; set; }
        public System.String ReceiveNote { get; set; }
        public System.String ReimburseName { get; set; }
        public System.DateTime ReimburseDate { get; set; }
        public System.Int32 ReimburseStatus { get; set; }
        public System.Int32 ReimburseStaffId { get; set; }
        public System.String ReimburseNote { get; set; }

        public System.String FileCode { get; set; }
        public System.String Votes { get; set; }
        public System.String Name { get; set; }
        public System.DateTime BorrowDate { get; set; }
        public System.Int32 Status { get; set; }
        public System.DateTime AppointmentDate { get; set; }
        public System.String Title { get; set; }


    }
}
