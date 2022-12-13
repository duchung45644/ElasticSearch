using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class ApproveModel : Approve
    {
        public int TotalRowCount { get; set; }
        public List<AttachmentOfApprove> ListAttachment { get; set; }
        public List<RecordModel> ApproveId { get; set; }
        public List<RecordModel> ApproveRefuseId { get; set; }
        public List<int> ListRecord { get; set; }
        public string Approver { get; set; }
 		public string Personrefuse { get; set; }    
}
}