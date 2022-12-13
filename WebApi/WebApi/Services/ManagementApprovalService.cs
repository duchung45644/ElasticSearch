using System.Collections.Generic;
using WebApi.Models.Request;
using WebApi.Models;
using WebApi.Repository;
using System.Linq;
using System.Xml.Linq;

namespace WebApi.Services
{
    public interface IManagementApprovalService
    {
        PagedData<RegistrasionlistModel> GetPageData(GetByPageRequest request);

        RegistrasionlistModel GetInforBorrowSlipById(int id);

        Response Approval(RegistrasionlistModel entry);
        Response RefuseBorrowSlip(RegistrasionlistModel entry);
         

    }
    public class ManagementApprovalService : IManagementApprovalService
    {

        private readonly ICommonRepository _respository;

        public ManagementApprovalService(ICommonRepository respository)
        {
            _respository = respository;
        }
        
        public PagedData<RegistrasionlistModel> GetPageData(GetByPageRequest request)
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
            var sql = @" DECLARE @count INT,
                        @PageLowerBound INT;
                        SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
                        SELECT @count = COUNT(1)
                        FROM [esto].[Registrasionlist] c
                        left join acc.Staff s on s.Id = c.RegisterUser
                        left join esto.Record e on c.RecordId = e.Id
                        WHERE 1 = 1  and c.Status = 2 " + sqlwhere + @"
                        
                        SELECT @count AS TotalRowCount, c.*,concat ( s.FirstName,' ',s.LastName) as FullName, e.Title
                        FROM [esto].[Registrasionlist] c
                        left join acc.Staff s on s.Id = c.RegisterUser
                        left join esto.Record e on c.RecordId = e.Id
                        WHERE 1 = 1 and c.Status = 2 " + sqlwhere + @" 
                        ORDER BY  " + SortFile + request.SortDirection + @"
                        OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
                        ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<RegistrasionlistModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RegistrasionlistModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public RegistrasionlistModel GetInforBorrowSlipById(int id)
        {
            var model = _respository.GetObjectByStore<RegistrasionlistModel>("[esto].Prc_RegisId", new { Id = id });

            model.DocRequests = _respository.GetListByStore<DocofrequestModel>("[esto].[Prc_GetDocumentByRegistrationId]", new { Id = id });
            return model;
        }

        public Response Approval(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                new XElement("Id", j.Id),
                new XElement("DocumentArchiveId", j.DocumentArchiveId),
                new XElement("AgreeStatus", j.AgreeStatus)
                ))
               );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_ListUpdate]",
                new
                {
                    Id = entry.Id,
                    ApprovedUser = entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }

        public Response RefuseBorrowSlip(RegistrasionlistModel entry)
        {
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RefuseBorrowSlip]", new { entry.Id });
            return response;
        }
    }
}
