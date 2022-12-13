using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IRecordtypeService
    {
        IEnumerable<RecordtypeModel> GetAllRecordtype();
        PagedData<RecordtypeModel> GetByPage(GetByPageRequest request);

        Response Create(RecordtypeModel entry);
        RecordtypeModel GetRecordTypeById(int id);
        Response Update(RecordtypeModel entry);
        Response Delete(int id);

    }
    public class RecordtypeService : IRecordtypeService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public RecordtypeService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<RecordtypeModel> GetAllRecordtype()
        {
            var positions = _respository.GetListByStore<RecordtypeModel>("[dbo].[Prc_RecordTypeGetAll]", new { });

            return positions;
        }

        public PagedData<RecordtypeModel> GetByPage(GetByPageRequest request)
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
FROM [dbo].[RecordType] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*
FROM [dbo].[RecordType] c
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<RecordtypeModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RecordtypeModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public RecordtypeModel GetRecordTypeById(int id)
        {
            return _respository.GetObjectByStore<RecordtypeModel>("[dbo].[Prc_RecordTypeGetById]", new { Id = id });
        }


        public Response Create(RecordtypeModel entry)
        {
            var arg = new
            {
                entry.Code,
                entry.Name,
                entry.SortOrder,
               
                entry.Description,
               
                UserId = entry.CreatedUserId

            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RecordTypeInsert]", arg);
            return response;
        }


        public Response Update(RecordtypeModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.Code,
                entry.Name,
                entry.SortOrder,
               
                entry.Description,
               
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RecordTypeUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RecordTypeDelete]", arg);
            return response;
        }



    }
}

