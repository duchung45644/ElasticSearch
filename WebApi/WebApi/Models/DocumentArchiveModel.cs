using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Base.esto;

namespace WebApi.Models
{
    public class DocumentArchiveModel: DocumentArchive
    {
        public List<AttachmentOfDocumentArchiveModel> attachmentOfDocumentArchives { get; set; }
        public int TotalRowCount { get; set; }
        public List<long> documentArchiveList { get; set; }
        public string ConditionName { get; set; }
        public bool disable { get; set; }
        public long DocumentArchiveId { get; set; }
        public string DocName { get; set; }
        public string Extension { get; set; }
    }
}
