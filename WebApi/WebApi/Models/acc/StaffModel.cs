using System.Collections.Generic;

using WebApi.Models;

namespace WebApi.Models
{
    public class StaffModel : Staff
    {
        public int TotalRowCount { get; set; }
        public string DisplayName => $"{FirstName} {LastName}";
        public string DisplayStaffName
        {
            get
            {
                if (string.IsNullOrWhiteSpace(PositionName))
                {
                    return $"{FirstName} {LastName}";
                }
                return $"{FirstName} {LastName} <i>({PositionName})</i>";
            }
        }

        public string StatusText
        {
            get
            {
                var status = "Hoạt động";
                if (IsLocked)
                    status = "Tạm ngừng hoạt động";
                return status;
            }
        }
        public string StaffName { get; set; }
        public string DepartmentName { get; set; }
        public string ReturnUrl { get; set; }
        public string BirthOfDayStr { get; set; }
        public string IDCardDateStr { get; set; }
        public string PositionName { get; set; }
        public string GenderName { get; set; }
        public List<System.Int32> InsertRoles { get; set; }
        public List<System.Int32> DeletedRoles { get; set; }

        public string NewPassword { get; set; }
    public string ConfirmPassword{ get; set; }
    }

}
