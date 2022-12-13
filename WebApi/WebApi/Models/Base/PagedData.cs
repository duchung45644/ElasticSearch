using System.Collections.Generic;

namespace WebApi.Models
{
    public class PagedData<T> : Response
    {
        public PagedData()
        {
        }
        public PagedData(List<T> listObj,int rows,int pageSize, int pageIndex)
        {
            ListObj = listObj;
            Pagination = new PaginationModel()
            {
                PageSize = pageSize,
                CurrentPage = pageIndex,
                NumberOfRows = rows
            };
        }

        public List<T> ListObj { get; set; }
        public PaginationModel Pagination { get; set; }
    }
}
