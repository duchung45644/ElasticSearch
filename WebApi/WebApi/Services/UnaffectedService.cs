using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IUnaffectedService
    {

        IEnumerable<UnaffectedModel> GetAllUnaffected();
        Response Create(UnaffectedChildModel entry);
        UnaffectedModel GetUnaffectedById(int id);
        Response Update(UnaffectedChildModel entry);
        Response Delete(int id);
        PagedData<UnaffectedChildModel> GetByPage(GetByPageRequest request);
        IEnumerable<UnaffectedModel> GetAllUnaffectedByUnitId(int id);
        IEnumerable<UnaffectedChildModel> GetAllUnaffectedChild();
        UnaffectedChildModel GetUnaffectedChildById(int id);

    }
    public class UnaffectedService : IUnaffectedService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public UnaffectedService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<UnaffectedModel> GetAllUnaffected()
        {
            var unaffecteds = _respository.GetListByStore<UnaffectedModel>("[dbo].[Prc_UnaffectedGetAll]", new { });

            return unaffecteds;
        }
        public IEnumerable<UnaffectedChildModel> GetAllUnaffectedChild()
        {
            var unaffectedchilds = _respository.GetListByStore<UnaffectedChildModel>("[dbo].[Prc_UnaffectedChildGetAll]", new { });

            return unaffectedchilds;
        }

        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        /// 
        public PagedData<UnaffectedChildModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                UnaffectedId=request.UnaffectedId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";


            if (request.UnaffectedId > 0)
            {
                sqlwhere += " and c.UnaffectedId = @UnaffectedId ";
            }

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.UnaffectChildName LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
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
                    case "UnaffectChildName":
                        {
                            SortField = " c.UnaffectChildName ";
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
FROM [dbo].[UnaffectedChild] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*,u.Name as UnaffectedName
FROM [dbo].[UnaffectedChild] c left join dbo.Unaffected u on u.Id=c.UnaffectedId
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<UnaffectedChildModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<UnaffectedChildModel>(list, rows, request.PageSize, request.PageIndex);
        }
        public UnaffectedModel GetUnaffectedById(int id)
        {
            return _respository.GetObjectByStore<UnaffectedModel>("[dbo].[Prc_UnaFfectedGetById]", new { Id = id });
        }
        public UnaffectedChildModel GetUnaffectedChildById(int id)
        {
            return _respository.GetObjectByStore<UnaffectedChildModel>("[dbo].[Prc_UnaffectedChildGetById]", new { Id = id });
        }




        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(UnaffectedChildModel entry)
        {
           
            var arg = new
            {
               
                entry.UnaffectChildName,
                entry.Code,
               
                entry.UnaffectedId,
               entry.Status,
                UserId = entry.CreatedUserId


            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_UnaffectedChildInsert]", arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(UnaffectedChildModel entry)
        {
          
            var arg = new
            {
                entry.Id,
                entry.UnaffectChildName,
                entry.Code,

                entry.UnaffectedId,
                entry.Status,
               


            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_UnaffectedChildUpdate]", arg);
            return response;
        }

        /// <summary>
        /// Delete the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_UnaffectedChildDelete]", arg);
            return response;
        }

        public IEnumerable<UnaffectedModel> GetAllUnaffectedByUnitId(int id)
        {
            var unaffecteds = _respository.GetListByStore<UnaffectedModel>("[dbo].[Prc_UnaffectedGetByUnitId]", new { UnitId = id });

            return unaffecteds;
        }

    }
}

