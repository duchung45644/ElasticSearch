using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IConditionService
    {
        IEnumerable<ConditionModel> GetAllCondition();
        PagedData<ConditionModel> GetByPage(GetByPageRequest request);

        Response Create(ConditionModel entry);
        ConditionModel GetConditionById(int id);
        Response Update(ConditionModel entry);
        Response Delete(int id);

    }
    public class ConditionService : IConditionService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public ConditionService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<ConditionModel> GetAllCondition()
        {
            var conditions = _respository.GetListByStore<ConditionModel>("dbo.[Prc_ConditionGetAll]", new { });

            return conditions;
        }

        public PagedData<ConditionModel> GetByPage(GetByPageRequest request)
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
                sqlwhere += " AND  ( c.ConditionName LIKE '%' + @Keyword + '%' OR c.Description LIKE '%' + @Keyword + '%'   ) ";
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
                    case "ConditionName":
                        {
                            SortField = " c.ConditionName ";
                            break;
                        }
                    case "Description":
                        {
                            SortField = " c.Description ";
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
FROM [dbo].[Condition] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*
FROM [dbo].[Condition] c
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<ConditionModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<ConditionModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public ConditionModel GetConditionById(int id)
        {
            return _respository.GetObjectByStore<ConditionModel>("[dbo].Prc_ConditionGetById", new { Id = id });
        }


        public Response Create(ConditionModel entry)
        {
            var arg = new
            {
              
                entry.ConditionName,
                entry.SortOrder,
       
                entry.Description,
              

            };
            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_ConditionInsert", arg);
            return response;
        }


        public Response Update(ConditionModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.ConditionName,
           
                entry.SortOrder,
               
                entry.Description,
               
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_ConditionUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_ConditionDelete]", arg);
            return response;
        }



    }
}

