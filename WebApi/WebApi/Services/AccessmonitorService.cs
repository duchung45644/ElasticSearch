using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IAccessmonitorService
    {
        IEnumerable<MonitorModel> GetAllMonitor();
        PagedData<MonitorModel> GetByPage(GetByPageRequest request);
        List<MonitorModel> GetByPageAssetsPrint(GetByPageRequest request);
        List<MonitorModel> GetByPageExcelAccessmonitor(GetByPageRequest request);

    }
    public class MonitorService : IAccessmonitorService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public MonitorService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<MonitorModel> GetAllMonitor()
        {
            var monitors = _respository.GetListByStore<MonitorModel>("dbo.[Prc_MonitorGetAll]", new { });

            return monitors;
        }

        // EX


        public PagedData<MonitorModel> GetByPage(GetByPageRequest request)
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
                request.SortDirection,
                intId = request.intId,
                DateAddStart = request.DateAddStart,
                DateAddEnd = request.DateAddEnd,
            };



            var sqlwhere = "";
            //if(request.intId != 0)
            //{
            //    sqlwhere += " AND a.intId = @intId";
            //}
            if (request.DateAddStart != "" && request.DateAddStart != null)
            {
                sqlwhere += " AND AccessDate >= @DateAddStart";
            }
            if (request.DateAddEnd != "" && request.DateAddEnd != null)
            {
                sqlwhere += " AND (AccessDate between @DateAddStart and @DateAddEnd  )";
            }


            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.Object LIKE '%' + @Keyword + '%' OR c.Description LIKE '%' + @Keyword + '%' OR c.UserId LIKE '%' + @Keyword + '%'   ) ";
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
                    case "Object":
                        {
                            SortField = " c.Object ";
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
FROM [dbo].[Monitor] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.* ,concat ( s.FirstName,' ',s.LastName) as FullName
FROM [dbo].[Monitor] c
left join acc.Staff s on s.Id = c.UserId
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<MonitorModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<MonitorModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public List<MonitorModel> GetByPageAssetsPrint(GetByPageRequest request)
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
                request.SortDirection,
                intId = request.intId,
                DateAddStart = request.DateAddStart,
                DateAddEnd = request.DateAddEnd,
            };



            var sqlwhere = "";


            if (request.DateAddStart != "" && request.DateAddStart != null)
            {
                sqlwhere += " AND AccessDate >= @DateAddStart";
            }
            if (request.DateAddEnd != "" && request.DateAddEnd != null)
            {
                sqlwhere += " AND (AccessDate between @DateAddStart and @DateAddEnd  )";
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
                    case "Object":
                        {
                            SortField = " c.Object ";
                            break;
                        }
                    case "AccessDate":
                        {
                            SortField = " c.AccessDate ";
                            break;
                        }

                    default:
                        SortField = " c.Id ";
                        break;
                }
            }
            var sql = @"
SELECT c.*,concat ( s.FirstName,' ',s.LastName) as FullName
FROM [dbo].[Monitor] c 
left join acc.Staff s on s.Id = c.UserId
WHERE 1 = 1 " + sqlwhere + @""
;

            var rows = 0;

            var list = _respository.GetListBySqlQuery<MonitorModel>(sql, arg);


            return list;


        }


        public List<MonitorModel> GetByPageExcelAccessmonitor(GetByPageRequest request)
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
                request.SortDirection,
                intId = request.intId,
                DateAddStart = request.DateAddStart,
                DateAddEnd = request.DateAddEnd,
            };
            var sqlwhere = "";




            if (request.DateAddStart != "" && request.DateAddStart != null)
            {
                sqlwhere += " AND ReceiveDate >= @DateAddStart";
            }
            if (request.DateAddEnd != "" && request.DateAddEnd != null)
            {
                sqlwhere += " AND (ReceiveDate between @DateAddStart and @DateAddEnd  )";
            }







            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND (c.Id Like '%' + @Keyword + '%' OR c.Votes LIKE '%' + @Keyword + '%' )";
            }
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = "desc ";
            }
            var SortFile = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortFile = " c.Id ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "Name":
                        {
                            SortFile = " c.Id ";
                            break;
                        }
                    case "Votes":
                        {
                            SortFile = " c.Votes ";
                            break;
                        }

                    default:
                        SortFile = " c.Id ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
        @PageLowerBound INT;
SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
SELECT @count = COUNT(1)  
FROM [esto].[Docofrequest] c 
left join esto.Registrasionlist r on c.RegistrasionlistId=r.Id 
WHERE 1 = 1 " + sqlwhere +
        @"

SELECT @count AS TotalRowCount,
        c.*,r.FileCode, 

d.Title,
r.AppointmentDate,
r.Votes,
r.Name,
r.BorrowDate,
c.ReceiveDate,
c.ReimburseDate,
r.Status,
c.ReimburseStatus,
r.UnitId,
r.CreatedUserId,
r.FondId,
CONCAT (s.LastName , s.FirstName) as FullName
FROM [esto].[Docofrequest] c 
left join esto.Registrasionlist r on c.RegistrasionlistId=r.Id 
left join esto.Record d on r.RecordId=d.Id
left join acc.Staff s on s.Id = r.CreatedUserId
WHERE 1 = 1 and (r.Status = 3 or r.Status = 4)" + sqlwhere +
    @" 
    ORDER BY  " + SortFile + request.SortDirection + @" ";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<MonitorModel>(sql, arg);

            return list;





        }




    }
}

