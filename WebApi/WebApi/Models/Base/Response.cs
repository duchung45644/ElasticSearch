﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class ListObjResponse<T> : Response
    {
        public List<T> Objs { get; set; }
    }
    public class Response
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="Response"/> is success.
        /// </summary>
        /// <value><c>true</c> if success; otherwise, <c>false</c>.</value>
        public bool Success { get; set; }
        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>The message.</value>
        public string Message { get; set; }
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>The identifier.</value>
        public object Id { get; set; }

        public int RowsAffected { get; set; }
        public int ReturnId { get; set; }
        public string ReturnStringId { get; set; }
    }
}
