using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Base.esto;

namespace WebApi.Models
{
    public class RecordModel : Record
    {
        public List<int> ListRecord { get; set; }
        public List<ApproveModel> ListApprove { get; set; }
        public int TotalRowCount { get; set; }
        public string QRCodeStr { get; set; }
        public string WareHouseName { get; set; }
        public DateTime? CancelTime { get; set; }
        public Boolean Selected { get; set; }
        public string MaintenanceName { get; set; }
        public string RightName { get; set; }
        public string ReceiveName { get; set; }
        public string ResponName { get; set; }
       
        public string CateMaintenance { get; set; }
        public string CateRights { get; set; }
        public string CateLanguage { get; set; }
        public long RecordId { get; set; }
        public string FieldName { get; set; }
        public string Extension { get; set; }




    }
}
