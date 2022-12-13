using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.dbo
{
    public class tblUser
    {
		public System.Int32 intUser { get; set; }
		public System.String txtLoginID { get; set; }
		public System.String txtSessionKey { get; set; }
		public System.String txtFullname { get; set; }
		public System.String txtSurname { get; set; }
		public System.Int32? intTimeZone { get; set; }
		public System.Int32? intProfileRef { get; set; }
		public System.Int32? intRoleRef { get; set; }
		public System.Int32? intCateID { get; set; }
		public System.Int32? intSiteRef { get; set; }
		public System.Int32? intDepartmentRef { get; set; }
		public System.Int32? intManagerRef { get; set; }
		public System.String txtDDI { get; set; }
		public System.String txtTelephone { get; set; }
		public System.String txtOffEmail { get; set; }
		public System.String txtPassword { get; set; }
		public System.String txtPhoto { get; set; }
		public System.Int32? intPending { get; set; }
		public System.Int32? intUserActive { get; set; }
		public System.Int32? intAccessViolations { get; set; }
		public System.Int32? intLoggedIn { get; set; }
		public System.Int32? intLoginCount { get; set; }
		public System.DateTime? txtLastLoginDate { get; set; }
		public System.DateTime? txtLastLogoutDate { get; set; }
		public System.DateTime? txtCreateDate { get; set; }
		public System.Int32? intDeleted { get; set; }
		public System.String txtEmail { get; set; }
		public System.String txtHomePage { get; set; }
		public System.String txtUniqueID { get; set; }
		public System.String txtUserType { get; set; }
		public System.String txtLastIP { get; set; }
		public System.Decimal? intReadTerms { get; set; }
		public System.Int32? intnumber1 { get; set; }
		public System.Int32? intnumber2 { get; set; }
		public System.Int32? intnumber3 { get; set; }
		public System.String txtfirstname { get; set; }
		public System.String txtmiddlename { get; set; }
		public System.String Address { get; set; }
		public System.Int32? intPageSize { get; set; }
		public System.Int32? intNumPageList { get; set; }
	}
}
