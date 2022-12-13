using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.dbo
{
    public class Cate
    {
		public System.Int32 intCateID { get; set; }
		public System.String txtparentid { get; set; }
		public System.String txttreeid { get; set; }
		public System.String txtCatename { get; set; }
		public System.String txtCatetDesc { get; set; }
		public System.Byte? visible { get; set; }
		public System.Byte? intdel { get; set; }
		public System.Byte? intCanDelete { get; set; }
		public System.Int32? intlevel { get; set; }
		public System.Int32? intDisplayOrder { get; set; }
		public System.String txttelephone { get; set; }
		public System.String txtfax { get; set; }
		public System.Int32? intProfile { get; set; }
		public System.Int32? ParentID { get; set; }
		public System.String CateCode { get; set; }
		public System.Int32 Id { get; set; }
		public System.Int32 UnitId { get; set; }

		public System.Boolean IsUnit { get; set; }
		public System.Int32 SortOrder { get; set; }
	}
}
