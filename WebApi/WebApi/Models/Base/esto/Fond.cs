using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.esto
{
    public class Fond
    {
        public System.Int32 Id { get; set; }
        public System.Int32 UnitId { get; set; }
        public System.Int32 ParentId { get; set; }
        public System.String FondCode { get; set; }
        public System.String FondName { get; set; }
        public System.String FondHistory { get; set; }
        public System.String ArchivesTime { get; set; }
        public System.Int32 PaperTotal { get; set; }
        public System.Int32 PaperDigital { get; set; }
        public System.String KeysGroup { get; set; }
        public System.Int32 FondType { get; set; }
        public System.String OtherType { get; set; }
        public System.Int32 LanguageId { get; set; }
        public System.String LookupTools { get; set; }
        public System.Int32 CoppyNumber { get; set; }
        public System.Int32 Status { get; set; }
        public System.String Description { get; set; }
        public System.Int32 ModifiedUserId { get; set; }
        public System.DateTime ModifiedDate { get; set; }
        public System.Int32 CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public Double Version { get; set; }
        public System.Int32 DepartmentId { get; set; }
        public System.Int32 CategoryId { get; set; }
    }
}
