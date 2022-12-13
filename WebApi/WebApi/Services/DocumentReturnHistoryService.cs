using System.Collections.Generic;
using WebApi.Models.Request;
using WebApi.Models;
using WebApi.Repository;
using System.Linq;
using System.Xml.Linq;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace WebApi.Services
{
    public interface IDocumentReturnHistoryService
    {
        PagedData<RegistrasionlistModel> GetDocumentReturnHistory(GetByPageRequest request);
        IEnumerable<RegistrasionlistModel> GetAllRegistrationListHistory();
        RegistrasionlistModel GetHistoryDocumentByRegistrationId(RegistrasionlistModel entry);
        
    }
    public class DocumentReturnHistoryService : IDocumentReturnHistoryService
    {

        private readonly ICommonRepository _respository;

        public DocumentReturnHistoryService(ICommonRepository respository)
        {
            _respository = respository; 
        }
        
        public PagedData<RegistrasionlistModel> GetDocumentReturnHistory(GetByPageRequest request)
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
                SortFile = " r.Id ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "Name":
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
                        SortFile = " r.Id ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
                        @PageLowerBound INT;
                        SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
                        SELECT DISTINCT TotalRowCount = (Select count(*) 
										                 from RegistrationListHistory r
                                                        left join [esto].[Registrasionlist] c on r.RegisId = c.Id
		                                                left join acc.Staff s on s.Id = c.RegisterUser
		                                                left join esto.Record e on c.RecordId = e.Id 
                                                        WHERE 1 = 1 " + sqlwhere + @"), 
						c.*,concat ( s.FirstName,' ',s.LastName) as FullName, e.Title, r.ReturnStatus as ReturnStatusHistory, r.ReturnDate as ReturnDateHistory , r.Id as HistoryId
		                    FROM RegistrationListHistory r
		                    left join [esto].[Registrasionlist] c on r.RegisId = c.Id
		                    left join acc.Staff s on s.Id = c.RegisterUser
		                    left join esto.Record e on c.RecordId = e.Id 
                        WHERE 1 = 1 " + sqlwhere + @" 
                        ORDER BY  " + SortFile + request.SortDirection + @"
                        OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
                        ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<RegistrasionlistModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RegistrasionlistModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public IEnumerable<RegistrasionlistModel> GetAllRegistrationListHistory()
        {
            var list = _respository.GetListByStore<RegistrasionlistModel>("Prc_GetAllRegistrationListHistory", new {});
            return list;
        }
         
        public RegistrasionlistModel GetHistoryDocumentByRegistrationId(RegistrasionlistModel entry)
        {
            var model = _respository.GetObjectByStore<RegistrasionlistModel>("[esto].Prc_RegisId", new { Id = entry.Id});

            model.DocRequests = _respository.GetListByStore<DocofrequestModel>("[esto].[Prc_GetHistoryDocumentByRegistrationId]", new { Id = entry.HistoryId });
            return model;
        }

    }
}
