using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Base.esto;

namespace WebApi.Models
{
    public class DocofrequestModel : Docofrequest
    {
        public int TotalRowCount { get; set; }
        public List<int> ListDocofrequest { get; set; }
        public System.String Title { get; set; }
        public string Votes { get; set; }
        public DateTime AppDate { get; set; }
        public System.Int32 Status { get; set; }
        public Boolean Selected { get; set; }
        public System.String DocCode { get; set; }
        public System.String Abstract { get; set; }
        public System.Int32 DocTypeId { get; set; }
        public String DocName { get; set; }
        public Int64 DocId { get; set; }
        public DateTime? ExtendDate { get; set; }


    }
}