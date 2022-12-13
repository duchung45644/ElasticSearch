using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.esto
{
    public class DocumentArchive
    {
        public System.Int64 Id { get; set; }
        public System.Int64? DocId { get; set; }
        public string DocCode { get; set; }
        public System.Int64? RecordId { get; set; }
        public System.Int32? UnitId { get; set; }
        public System.Int32? DocOrdinal { get; set; }
        public System.Int32? DocTypeId { get; set; }
        public System.Int32? Number { get; set; }
        public string DocNotation { get; set; }
        public string SubNumber { get; set; }
        public System.DateTime? PublishDate { get; set; }
        public string PublishUnitName { get; set; }
        public string Abstract { get; set; }
        public string Language { get; set; }
        public System.Int32? NumberPaper { get; set; }
        public System.Int32? NumberCopies { get; set; }
        public System.Int32? BrowsingStatus { get; set; }
        public string Description { get; set; }
        public string InforSign { get; set; }
        public string Keyword { get; set; }
        public string Mode { get; set; }
        public string ConfidenceLevel { get; set; }
        public string Autograph { get; set; }
        public int? Format { get; set; }
        public System.DateTime? ReceivedDate { get; set; }
        public string PublishUnitId { get; set; }
        public string Signer { get; set; }
        public System.DateTime? SignDate { get; set; }
        public System.Int32? SecretId { get; set; }
        public System.Int32? UrgentId { get; set; }
        public System.DateTime? ExpiredDate { get; set; }
        public System.Int32? DocFieldId { get; set; }
        public string AdjustmentCycle { get; set; }
        public System.DateTime? AdjustmentDate { get; set; }
        public System.Int32 IsDocumentOriginal { get; set; }
        public System.Int32? ModifiedUserId { get; set; }
        public System.DateTime? ModifiedDate { get; set; }
        public System.Int32? CreatedUserId { get; set; }
        public System.DateTime? CreatedDate { get; set; }
        public System.String FilePath { get; set; }
    }
}
