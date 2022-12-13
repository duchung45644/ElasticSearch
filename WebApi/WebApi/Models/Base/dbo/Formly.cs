using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Base.dbo
{
    public class Formly
    {
        public System.Int32 Id { get; set; }
        public System.String FormCode { get; set; }
        public System.String FormName { get; set; }
        public System.String FormJson { get; set; }
        public System.String Description { get; set; }
        public System.Boolean IsLocked { get; set; }

        public System.Int32 CreatedUserId { get; set; }
        public System.Int32 ModifiedUserId { get; set; }

        public System.DateTime CreatedDate { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    }
}
