using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IPositionService
    {
        IEnumerable<PositionModel> GetAllPosition();
        PagedData<PositionModel> GetByPage(GetByPageRequest request);

        Response Create(PositionModel entry);
        PositionModel GetPositionById(int id);
        Response Update(PositionModel entry);
        Response Delete(int id);

    }
    public class PositionService : IPositionService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public PositionService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<PositionModel> GetAllPosition()
        {
            var positions = _respository.GetListByStore<PositionModel>("dbo.[Prc_PositionGetAll]", new { });

            return positions;
        }

        public PagedData<PositionModel> GetByPage(GetByPageRequest request)
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
            {   sqlwhere += " AND  ( c.Name LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
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
FROM [dbo].[Position] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*
FROM [dbo].[Position] c
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<PositionModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<PositionModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public PositionModel GetPositionById(int id)
        {
            return _respository.GetObjectByStore<PositionModel>("[dbo].Prc_PositionGetById", new { Id = id });
        }


        public Response Create(PositionModel entry)
        {
            var arg = new
            {
                entry.Code,
                entry.Name,
                entry.SortOrder,
                entry.IsLeader,
                entry.Description,
                entry.IsLocked,
                UserId = entry.CreatedUserId

            };
            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_PositionInsert", arg);
            return response;
        }


        public Response Update(PositionModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.Code,
                entry.Name, 
                entry.SortOrder,
                entry.IsLeader,
                entry.Description,
                entry.IsLocked,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_PositionUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_PositionDelete]", arg);
            return response;
        }



    }
}

