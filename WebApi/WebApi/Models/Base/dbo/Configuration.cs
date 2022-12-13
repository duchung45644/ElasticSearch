using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.dbo
{
    public class Configuration
    {
		public int Id { get; set; }
		public string Code { get; set; }
		public string Name { get; set; }
		public string DisplayName { get; set; }
		public string Value { get; set; }
		public int SortOrder { get; set; }
		public bool IsLocked { get; set; }
	}
}
