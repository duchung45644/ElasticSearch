using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{
    public interface IReturnrecordService
    {
        IEnumerable<ReturnrecordModel> GetAllReturnrecord();
        PagedData<ReturnrecordModel> GetByPage(GetByPageRequest request);

        Response CreateReturncord(ReturnrecordModel entry);
        Response CreateRequest(ReturnrecordModel entry);
        ReturnrecordModel GetByID(int id);
        Response UpdateReturncord(ReturnrecordModel entry);
        Response UpdateRequest(ReturnrecordModel entry);
    }
    public class ReturnrecordService : IReturnrecordService
    {
        private readonly ICommonRepository _respository;

        public ReturnrecordService(ICommonRepository respository)
        {
            _respository = respository;
        }

        public IEnumerable<ReturnrecordModel> GetAllReturnrecord()
        {
            var returnrecord = _respository.GetListByStore<ReturnrecordModel>("dbo.[Prc_FondGetAll]", new { });

            return returnrecord;
        }

        public PagedData<ReturnrecordModel> GetByPage(GetByPageRequest request)
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
                sqlwhere += " AND (c.FondName Like '%' + @Keyword + '%' OR c.UnitId LIKE '%' + @Keyword + '%' )";
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
                            SortFile = " c.FondName ";
                            break;
                        }
                    case "Code":
                        {
                            SortFile = " c.FondCode ";
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
FROM [dbo].[ReturnRecord] c
WHERE 1 = 1 " + sqlwhere +
        @"

SELECT @count AS TotalRowCount,
        c.*
FROM [dbo].[ReturnRecord] c

WHERE 1 = 1 " + sqlwhere +
    @" 

    ORDER BY  " + SortFile + request.SortDirection + @"
            OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<ReturnrecordModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<ReturnrecordModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public ReturnrecordModel GetByID(int id)
        {
            return _respository.GetObjectByStore<ReturnrecordModel>("[dbo].Prc_ReturnrecordGetById", new { Id = id });
        }

        public Response CreateReturncord(ReturnrecordModel entry)
        {
            var arg = new
            {
               entry.RegistrasionlistId,
               entry.Title,
               entry.PaidContent
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_ReturnrecordInsert", arg);
            return response;
        }

        public Response UpdateReturncord(ReturnrecordModel entry)
        {
            var arg = new
            {
                entry.RegistrasionlistId,
                entry.Title,
                entry.PaidContent

            };
            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_ReturnrecordUpdate", arg);
            return response;
        }
        public Response CreateRequest(ReturnrecordModel entry)
        {
            var arg = new
            {
              
                entry.Title,
                entry.CancelContent
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_RequestInsert", arg);
            return response;
        }

        public Response UpdateRequest(ReturnrecordModel entry)
        {
            var arg = new
            {
                entry.RegistrasionlistId,
                entry.Title,
                entry.CancelContent
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_RequestUpdate", arg);
            return response;
        }
    }
}
