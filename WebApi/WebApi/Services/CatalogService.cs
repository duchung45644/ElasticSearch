using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface ICatalogService
    {
        IEnumerable<CatalogModel> GetAllCatalog();
        PagedData<CatalogModel> GetByPage(GetByPageRequest request);

        Response Create(CatalogModel entry);
        CatalogModel GetCatalogById(int id);
        Response Update(CatalogModel entry);
        Response Delete(int id);
        Response RowSelectionChangeLog(CatalogModel entry);

    }
    public class CatalogService : ICatalogService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public CatalogService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<CatalogModel> GetAllCatalog()
        {
            var catalogs = _respository.GetListByStore<CatalogModel>("[dbo].[Prc_CatalogGetAll]", new { });

            return catalogs;
        }

        public PagedData<CatalogModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {

                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";




            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.Name LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
            }
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = " desc ";
            }
            var SortField = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortField = " c.Id ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "Name":
                        {
                            SortField = " c.Name ";
                            break;
                        }
                    case "Code":
                        {
                            SortField = " c.Code ";
                            break;
                        }

                    default:
                        SortField = " c.Id ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
        @PageLowerBound INT;
SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
SELECT @count = COUNT(1)
FROM [dbo].[Catalog] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*
FROM [dbo].[Catalog] c
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<CatalogModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<CatalogModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public CatalogModel GetCatalogById(int id)
        {
            return _respository.GetObjectByStore<CatalogModel>("[dbo].[Prc_CatalogGetById]", new { Id = id });
        }


        public Response Create(CatalogModel entry)
        {
            var arg = new
            {
                entry.Code,
                entry.Name,
                entry.SortOrder,
                entry.ParentId,
                entry.Description,

                UserId = entry.CreatedUserId

            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_CatalogInsert]", arg);
            return response;
        }


        public Response Update(CatalogModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.Code,
                entry.Name,
                entry.SortOrder,
                entry.ParentId,
                entry.Description,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_CatalogUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_CatalogDelete]", arg);
            return response;
        }

        public Response RowSelectionChangeLog(CatalogModel entry)
        {
            var ListCatalog = string.Join(',', entry.ListCatalog);
            var arg = new
            {
                ListCatalog = ListCatalog
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RowSelectionChangeLogCatalog]", arg);
            return response;
        }

    }
}


