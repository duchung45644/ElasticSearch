namespace WebApi.Models
{
    public class UploadFilesResult
    {
        public string Name { get; set; }
        public int Length { get; set; }
        public string Type { get; set; }
        public string Url { get; set; }
        public bool Success { get;  set; }
        public string Message { get;  set; }
    }
}
