namespace WebApi.Models 
{
	public  class Log 
	{
		public System.Int32 LogId { get; set; } 
		public System.String ErrorMessage { get; set; } 
		public System.DateTime? ErrorDateTime { get; set; } 
		public System.String ObjectError { get; set; } 
		public System.String InnerException { get; set; } 
		public System.String ErrorStackTrace { get; set; } 
		public System.String ErrorCode { get; set; } 
	}

}
