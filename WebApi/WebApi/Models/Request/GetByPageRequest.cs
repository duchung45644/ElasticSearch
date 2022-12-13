using System;
using System.Collections.Generic;
using System.Text;
namespace WebApi.Models.Request
{
    public class GetByPageRequest : BaseRequest
    {
        /// <summary>
        /// </summary>
        public bool IsLoginUnitOnly{ set; get; }
        /// <summary>

        /// </summary>
        public bool IsUnitOnly { set; get; }
        public System.Boolean CanSelect { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Id { get; set; }
        public string SortField { get; set; }
        public int BorrowID { get; set; }
        
        public string SortDirection { get; set; }
        public string KeyWord { get; set; }
        public string Code { get; set; }
        public int ProvinceId { get; set; }
        public int ShelfTypeId { get; set; }
        public int PublicSectorId { get; set; }
        public int SortOrder { get; set; }
        public string Name { get; set; }
        public string DossierName { get; set; }
        public int DistrictId { get; set; }
        public int DepartmentId { get; set; }
        public int KeyNodeSelected { get; set; }
        public int WarehouseId { get; set; }
        public int intId { get; set; }
        public string Object { get; set; }
        public int TypeId { get; set; }
        public string Description { get; set; }
        public int ShelfId { get; set; }
        public int BoxId { get; set; }
        public string DateAddStart { get; set; }
        public string DateAddEnd { get; set; }
        public List<RecordModel> ListRecords { get; set; }
        public int Status { get; set; }
        public long RecordId { get; set; }
        public int ApproveId { get; set; }

        public string logbookborrowedForm { get; set; }
        public string ReceiveDate { get; set; }
        public string AppointmentDate { get; set; }
        public string ReimburseDate { get; set; }
        public string Title { get; set; }
        public string ReceiverName { get; set; }
        public int UnaffectedId { get; set; }
        public int StorageStatus { get; set; }
        public int CreatedUserId { get; set; }
        public string FileName { get; set; }
    }
}
