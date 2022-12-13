using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.dbo
{
    public class Monitor
    {
		public System.Int32 Id { get; set; }
		public System.Int32 Type { get; set; }
		public DateTime AccessDate { set; get; }
		public System.Int32 UserId { get; set; }
		public System.String Ip { get; set; }
		public System.String Description { get; set; }
		public System.String FullName { get; set; }
		public System.String Object { get; set; }
		public string logbookborrowedForm { get; set; }
		public string ReceiveDate { get; set; }
		public string AppointmentDate { get; set; }
		public string ReimburseDate { get; set; }
		public string Title { get; set; }
		public string ReceiverName { get; set; }
		public string Status { get; set; }
	}
}
