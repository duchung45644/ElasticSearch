using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{
    public interface IPayRecordService
    {
        IEnumerable<PayRecordModel> GetAllPayRecord();
        PagedData<PayRecordModel> GetByPage(GetByPageRequest request);

        Response CreatePayRecord(PayRecordModel entry);
        PayRecordModel GetByID(int id);
        Response UpdatePayRecord(PayRecordModel entry);

    }
    public class PayRecordService : IPayRecordService
    {
        private readonly ICommonRepository _respository;

        public PayRecordService(ICommonRepository respository)
        {
            _respository = respository;
        }

        public IEnumerable<PayRecordModel> GetAllPayRecord()
        {
            var fond = _respository.GetListByStore<PayRecordModel>("dbo.[Prc_FondGetAll]", new { });

            return fond;
        }

        public PagedData<PayRecordModel> GetByPage(GetByPageRequest request)
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
                sqlwhere += " AND (c.Id Like '%' + @Keyword + '%' OR c.UnitId LIKE '%' + @Keyword + '%' )";
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
                            SortFile = " c.Id ";
                            break;
                        }
                    case "Code":
                        {
                            SortFile = " c.UnitId ";
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
FROM [esto].[Registrasionlist] c
WHERE 1 = 1 and c.Status = 6" + sqlwhere +
        @"
SELECT @count AS TotalRowCount,
        c.*
FROM [esto].[Registrasionlist] c

WHERE 1 = 1 and c.Status = 6  " + sqlwhere +
    @" 

    ORDER BY  " + SortFile + request.SortDirection + @"
            OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<PayRecordModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<PayRecordModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public PayRecordModel GetByID(int id)
        {
            return _respository.GetObjectByStore<PayRecordModel>("[esto].Prc_FondGetById", new { Id = id });
        }

        public Response CreatePayRecord(PayRecordModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",

                   new XElement("ReimburseDate", j.ReimburseDate)))
           );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_UpdatePayRecord]",
                new
                {
                    entry.Id,

                    DocRequests = assets.ToString()
                });
            return response;
        }

        public Response UpdatePayRecord (PayRecordModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                    
                    new XElement("ReimburseDate", j.ReimburseDate)))
            );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_UpdatePayRecord]",
                new
                {
                    entry.Id,
                    entry.ReimburseName,
                    entry.ReimburseStatus,
                    entry.ReimburseStaffId,
                    entry.ReimburseNote,
                    DocRequests = assets.ToString()
                });
            return response;
        }

    }
}
