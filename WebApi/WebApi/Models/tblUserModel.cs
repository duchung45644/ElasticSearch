﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using WebApi.Models.Base.dbo;

namespace WebApi.Models
{
    public class tblUserModel : tblUser
    {
        public int TotalRowCount { get; set; }
    }
}