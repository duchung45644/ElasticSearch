using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IFieldsService
    {
        IEnumerable<FieldsModel> GetAllFields();
        PagedData<FieldsModel> GetByPage(GetByPageRequest request);

        Response Create(FieldsModel entry);
        FieldsModel GetFieldsById(int id);
        Response Update(FieldsModel entry);
        Response Delete(int id);
      

    }
    public class FieldsService : IFieldsService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public FieldsService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<FieldsModel> GetAllFields()
        {
            var fieldss = _respository.GetListByStore<FieldsModel>("[dbo].[Prc_FieldsGetAll]", new { });

            return fieldss;
        }

        public PagedData<FieldsModel> GetByPage(GetByPageRequest request)
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
FROM [dbo].[Fields] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*
FROM [dbo].[Fields] c
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<FieldsModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<FieldsModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public FieldsModel GetFieldsById(int id)
        {
            return _respository.GetObjectByStore<FieldsModel>("[dbo].[Prc_FieldsGetById]", new { Id = id });
        }


        public Response Create(FieldsModel entry)
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
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_FieldsInsert]", arg);
            return response;
        }


        public Response Update(FieldsModel entry)
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
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_FieldsUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_FieldsDelete]", arg);
            return response;
        }

       

    }
}


