using System.Collections.Generic;
using WebApi.Models.Request;
using WebApi.Models;
using WebApi.Repository;
using System.Linq;
using System.Xml.Linq;

namespace WebApi.Services
{
    public interface IBorrowSlipListService
    {
        PagedData<RegistrasionlistModel> GetBorrowSlipList(GetByPageRequest request);
    }
    public class BorrowSlipListService : IBorrowSlipListService
    {

        private readonly ICommonRepository _respository;

        public BorrowSlipListService(ICommonRepository respository)
        {
            _respository = respository;
        }
        
        public PagedData<RegistrasionlistModel> GetBorrowSlipList(GetByPageRequest request)
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
                sqlwhere += " AND (s.FirstName Like '%' + @Keyword + '%' OR s.LastName LIKE '%' + @Keyword + '%' OR e.Title LIKE '%' + @Keyword + '%' )";
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
                    case "name":
                        {
                            SortFile = " c.Name ";
                            break;
                        }
                    case "Code":
                        {
                            SortFile = " c.Votes ";
                            break;
                        }

                    default:
                        SortFile = " c.Id ";
                        break;
                }
            }
            var sql = @"DECLARE @count INT,
                        @PageLowerBound INT;
                        SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
                        SELECT @count = COUNT(1)
                            FROM [esto].[Registrasionlist] c
                            left join acc.Staff s on s.Id = c.RegisterUser
                            left join esto.Record e on c.RecordId = e.Id
                            WHERE 1 = 1 and c.Status <> -1 " + sqlwhere + @"
                        
                        SELECT DISTINCT @count AS TotalRowCount, c.*,concat ( s.FirstName,' ',s.LastName) as FullName, e.Title
                            FROM [esto].[Registrasionlist] c
                            left join acc.Staff s on s.Id = c.RegisterUser
                            left join esto.Record e on c.RecordId = e.Id
                            WHERE 1 = 1 and c.Status <> -1" + sqlwhere + @" 
                            ORDER BY  " + SortFile + request.SortDirection + @"
                            OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
                        ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<RegistrasionlistModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RegistrasionlistModel>(list, rows, request.PageSize, request.PageIndex);
        }

    }
}
