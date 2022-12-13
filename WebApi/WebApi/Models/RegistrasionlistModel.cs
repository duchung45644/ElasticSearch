using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Base.esto;

namespace WebApi.Models
{
    public class RegistrasionlistModel : Registrasionlist
    {
        public int TotalRowCount { get; set; }
        public List<RegistrasionlistModel> ListRegistrasionlist { get; set; }
        public List<DocofrequestModel> DocRequests { get; set; }
        public List<DocumentArchiveModel> DocumentArchives { get; set; }
        public List<int> ListRegistrasionlist_Cancel { get; set; }
        public List<int> RegisLists_delete { get; set; }
        public Int32 DocTypeId { get; set; }
        public Int32 NumberCopies { get; set; }
        public String DocName { get; set; }
        public List<long> RegisList { get; set; }
        public System.String ExtendDateStr { get; set; }
        public System.String ExtendDateRecordStr { get; set; }
        public System.String AppointmentDateStr { get; set; }




    }
}