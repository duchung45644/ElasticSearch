using System;

namespace WebApi.Models.Request
{
    public class GetByIdRequest<T> : BaseRequest
    {
        public T Id { get; set; }
        public long bigId { get; set; }
        public T SecondId { get; set; }
        
        public DateTime ReceivedDate { get; set; }
        public string ReceivedDateStr { get; set; }
        public bool IsDoc { get; set; }
        public int TypeId { get; set; }
        public long HandlingType { get; set; }
        public int UnitIdChargeId { get; set; }
        public int Status { get; set; }
        public int ProcessingStatus { get; set; }
    }
}
