////using System;
////using System.Collections.Generic;
////using System.Linq;
////using System.Threading.Tasks;
////using WebApi.Models;
////using WebApi.Models.Request;
////using WebApi.Repository;

////namespace WebApi.Services
////{
////    public interface IDepartmentlevelService
////    {
////        IEnumerable<DepartmentlevelModel> GetAllDepartmentlevel();
////        PagedData<DepartmentlevelModel> GetByPage(GetByPageRequest request);

////        Response Create(DepartmentlevelModel entry);
////        DepartmentlevelModel GetDepartmentlevelById(int id);
////        Response Update(DepartmentlevelModel entry);
////        Response Delete(int id);
////    }

////    public class DepartmentlevelService : IDepartmentlevelService
////    {
////        /// <summary>
////        /// Declare resposity
////        /// </summary>
////        /// <param name="psqlConn"></param>
////        /// <author>louis</author>	
////        private readonly ICommonRepository _respository;

////        public DepartmentlevelService(ICommonRepository respository)
////        {
////            _respository = respository;
////        }

////        /// <summary>
////        /// Get all values
////        /// </summary>
////        /// <returns>List values</returns>
////        /// <author>Louis</author>
////        public IEnumerable<DepartmentlevelModel> GetAllDepartmentlevel()
////        {
////            var departmentlevels = _respository.GetListByStore<DepartmentlevelModel>("dbo.[Prc_CategoryGetAll]", new { });

////            return departmentlevels;
////        }

////        public PagedData<DepartmentlevelModel> GetByPage(GetByPageRequest request)
////        {

////            if (!string.IsNullOrWhiteSpace(request.KeyWord))
////            {
////                request.KeyWord = request.KeyWord.Trim();
////            }
////            var arg = new
////            {

////                KeyWord = request.KeyWord,
////                PageSize = request.PageSize,
////                PageIndex = request.PageIndex,
////                request.SortField,
////                request.SortDirection
////            };
////            var sqlwhere = "";




////            if (!string.IsNullOrWhiteSpace(request.KeyWord))
////            {
////                sqlwhere += " AND  ( c.Name LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
////            }
////            if (string.IsNullOrWhiteSpace(request.SortDirection))
////            {
////                request.SortDirection = " desc ";
////            }
////            var SortField = "";
////            if (string.IsNullOrWhiteSpace(request.SortField))
////            {
////                SortField = " c.CategoryId ";
////            }
////            else
////            {
////                switch (request.SortField)
////                {
////                    case "Name":
////                        {
////                            SortField = " c.Name ";
////                            break;
////                        }
////                    case "Code":
////                        {
////                            SortField = " c.Code ";
////                            break;
////                        }

////                    default:
////                        SortField = " c.CategoryId ";
////                        break;
////                }
////            }
////            var sql = @" DECLARE @count INT,
////        @PageLowerBound INT;
////SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
////SELECT @count = COUNT(1)
////FROM dbo.Category c join dbo.CategoryType ct on c.Code = ct.CategoryCode 
////WHERE 1 = 1 and c.Code = 'CAPGIAIQUYET' " + sqlwhere +
////    @" 
  
////SELECT @count AS TotalRowCount,
////       c.*
////FROM dbo.Category c join dbo.CategoryType ct on c.Code = ct.CategoryCode 
   
////WHERE 1 = 1 and c.Code = 'CAPGIAIQUYET' " + sqlwhere +
////    @" 
    
////    ORDER BY " + SortField + request.SortDirection + @"
////			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
//// ";
////            var rows = 0;

////            var list = _respository.GetListBySqlQuery<DepartmentlevelModel>(sql, arg);

////            if (list.Any()) rows = list.First().TotalRowCount;
////            return new PagedData<DepartmentlevelModel>(list, rows, request.PageSize, request.PageIndex);
////        }

////        public DepartmentlevelModel GetDepartmentlevelById(int id)
////        {
////            return _respository.GetObjectByStore<DepartmentlevelModel>("[dbo].Prc_CategoryGetById", new { CategoryId = id });
////        }


////        public Response Create(DepartmentlevelModel entry)
////        {
////            var arg = new
////            {
////                entry.Code,
////                entry.Name,
////                entry.ParentId,
////                entry.Order,
////                entry.CateName,
////                entry.Value,


////            };
////            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_CategoryDepartmentlevelInsert", arg);
////            return response;
////        }


////        public Response Update(DepartmentlevelModel entry)
////        {
////            var arg = new
////            {
////                entry.CategoryId,

////                entry.Name,
////                entry.ParentId,
////                entry.Order,
////                entry.CateName,
////                entry.Value,

////            };
////            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CategoryDepartmentlevelUpdate]", arg);
////            return response;
////        }


////        public Response Delete(int id)
////        {
////            var arg = new
////            {
////                CategoryId = id
////            };
////            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CategoryDelete]", arg);
////            return response;
////        }



////    }


////}

