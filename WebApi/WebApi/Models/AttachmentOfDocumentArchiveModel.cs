using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.Base.esto;

namespace WebApi.Models
{
    public class AttachmentOfDocumentArchiveModel: AttachmentOfDocumentArchive
    {
        public string AttachmentString => $"{FilePath}:{FileName}:{Extension}";
        public long TotalRowCount { get; set; }
    }
}
