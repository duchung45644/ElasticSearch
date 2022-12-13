using System.Collections.Generic;
using WebApi.Models.Request;
using WebApi.Models;
using WebApi.Repository;
using System.Linq;
using System.Xml.Linq;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace WebApi.Services
{
    public interface IBorrowReturnExtendService
    {
        PagedData<RegistrasionlistModel> GetBorrowReturnExtend(GetByPageRequest request);

        RegistrasionlistModel GetInforBorrowSlipById(int id);

        Response AddBorrowerInfor(RegistrasionlistModel entry);
        Response ExtendBorrowSlip(RegistrasionlistModel entry);
        Response ReturnBorrowSlip(RegistrasionlistModel entry);
        Response RequestReturn(RegistrasionlistModel entry);
        Response RefuseRequestReturn(RegistrasionlistModel entry);
    } 
    public class BorrowReturnExtendService : IBorrowReturnExtendService
    {

        private readonly ICommonRepository _respository;

        public BorrowReturnExtendService(ICommonRepository respository)
        {
            _respository = respository;
        }
        
        public PagedData<RegistrasionlistModel> GetBorrowReturnExtend(GetByPageRequest request)
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
                        SELECT @count = (SELECT DISTINCT COUNT(1)
                            FROM [esto].[Registrasionlist] c
                            left join acc.Staff s on s.Id = c.RegisterUser
                            left join esto.Record e on c.RecordId = e.Id
                            left join esto.DocOfRequest do on c.Id = do.RegistrasionlistId
                        WHERE 1 = 1 and  c.Status = 4 or c.Status = 6 or c.Status = 7 or c.Status = 8 " + sqlwhere + @")
                        

                        SELECT DISTINCT @count AS TotalRowCount, c.*, do.ReceiverName,concat ( s.FirstName,' ',s.LastName) as FullName, e.Title
                            FROM [esto].[Registrasionlist] c
                            left join acc.Staff s on s.Id = c.RegisterUser
                            left join esto.Record e on c.RecordId = e.Id
                            left join esto.DocOfRequest do on c.Id = do.RegistrasionlistId
                        WHERE 1 = 1 and  c.Status = 4 or c.Status = 6 or c.Status = 7 or c.Status = 8" + sqlwhere + @" 
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
        
        public Response AddBorrowerInfor(RegistrasionlistModel entry)
        {
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_AddBorrowerInfor]",
                new
                {
                    entry.Id,
                    entry.LenderId,
                    entry.ReceiveDate,
                    entry.ReceiveNote,
                    entry.ReceiveStatus,
                    entry.ReceiverName
                });
            return response;
        }
        
        public Response ExtendBorrowSlip(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                new XElement("Id", j.Id),
                new XElement("ExtendDate", j.ExtendDate)
                ))
               );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_ExtendBorrowSlip]",
                new
                {
                    entry.Id,
                    Refuse = entry.TotalRowCount, //Use to approval or refuse because i'm lazy to write another stored procedure, 0: Refuse, 1: Approval
                    DocRequests = assets.ToString()
                });
            return response;
        }
        
        public Response ReturnBorrowSlip(RegistrasionlistModel entry)
        {

            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                new XElement("Id", j.Id),
                new XElement("ReimburseStatus", j.ReimburseStatus)
                ))
               );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_ReturnBorrowSlip]",
                new
                {
                    entry.Id,
                    entry.ReimburseName,
                    entry.ReimburseNote,
                    entry.ReimburseStaffId,
                    DocRequests = assets.ToString()
                });
            return response;
        }

        public Response RequestReturn(RegistrasionlistModel entry)
        {
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RequestReturn]", new { entry.Id });
            return response;
        }

        public Response RefuseRequestReturn(RegistrasionlistModel entry)
        {
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RefuseRequestReturn]", new { entry.Id });
            return response;
        }


    }
}
