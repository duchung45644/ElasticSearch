using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Base.esto;

namespace WebApi.Models
{
    public class PayRecordModel : Registrasionlist
    {
        public int TotalRowCount { get; set; }
        public List<RegistrasionlistModel> ListRegistrasionlist { get; set; }
        public List<DocofrequestModel> DocRequests { get; set; }
        public List<DocumentArchiveModel> DocumentArchives { get; set; }
    }
}
