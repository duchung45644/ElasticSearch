using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class AttachmentOfApproveModel : AttachmentOfApprove
    {
        public int TotalRowCount { get; set; }
    }
}
