using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.esto
{
    public class Record
    {
        public long Id { get; set; }
        public int UnitId { get; set; }
        public int FondId { get; set; }
        public string FileCode { get; set; }
        public int? FileCatalog { get; set; }
        public string FileNotation { get; set; }
        public string Title { get; set; }
        public string Maintenance { get; set; }
        public string Rights { get; set; }
        public string Language { get; set; }
        public string RecordContent { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public int TotalDoc { get; set; }
        public string Description { get; set; }
        public string InforSign { get; set; }
        public string Keyword { get; set; }
        public int TotalPaper { get; set; }
        public int PageNumber { get; set; }
        public int Format { get; set; }
        public DateTime? ArchiveDate { get; set; }
        public int ReceptionArchiveId { get; set; }
        public int InChargeStaffId { get; set; }
        public int WareHouseId { get; set; }
        public int ShelfId { get; set; }
        public int BoxId { get; set; }
        public DateTime? ReceptionDate { get; set; }
        public int ReceptionFrom { get; set; }
        public string TransferStaff { get; set; }
        public int ModifiedUserId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public Int32 IsDocumentOriginal { get; set; }
        public int NumberOfCopy { get; set; }
        public int DocFileId { get; set; }
        public int Number { get; set; }
        public Boolean TransferOnlineStatus { get; set; }
        public string OtherType { get; set; }
        public string Version { get; set; }
        public int Status { get; set; }
        public int ApproveId { get; set; }
        public int ApproveRefuseId { get; set; }
        public string ShelfName { get; set; }
        public string BoxName { get; set; }
        public Boolean StorageStatus { get; set; }
    }
}
