using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;


namespace WebApi.Services
{
    public interface IRenewalprofileService
    {

        PagedData<RegistrasionlistModel> GetByPage(GetByPageRequest request);

        Response UpdateAddinformation(DocofrequestModel entry);
        RegistrasionlistModel GetByID(int id);
        DocumentArchiveModel GetByIDDocView(long id);
        IEnumerable<DocofrequestModel> GetByID_List(long id);
        IEnumerable<DocumentArchiveModel> GetByIDListView(int id);
        IEnumerable<ListModel> GetAllStaff();

    }
    public class RenewalprofileService : IRenewalprofileService
    {
        private readonly ICommonRepository _respository;

        public RenewalprofileService(ICommonRepository respository)
        {
            _respository = respository;
        }



        public PagedData<RegistrasionlistModel> GetByPage(GetByPageRequest request)
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
                sqlwhere += " AND (c.Name Like '%' + @Keyword + '%' OR c.Votes LIKE '%' + @Keyword + '%' )";
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
WHERE 1 = 1  and c.Status = 6" + sqlwhere +
        @"

SELECT @count AS TotalRowCount,
        c.*,concat ( s.FirstName,' ',s.LastName) as FullName,
e.Title, c.RecordId
FROM [esto].[Registrasionlist] c
left join acc.Staff s on s.Id = c.RegisterUser
left join esto.Record e on c.RecordId = e.Id
WHERE 1 = 1 and c.Status = 6 " + sqlwhere +
    @" 

    ORDER BY  " + SortFile + request.SortDirection + @"
            OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<RegistrasionlistModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RegistrasionlistModel>(list, rows, request.PageSize, request.PageIndex);
        }

        //public RegistrasionlistModel GetByID(int id)
        //{
        //    return _respository.GetObjectByStore<RegistrasionlistModel>("[esto].Prc_ListView", new { Id = id });
        //}
        public RegistrasionlistModel GetByID(int id)
        {
            var model = _respository.GetObjectByStore<RegistrasionlistModel>("[esto].Prc_ListView", new { Id = id });

            var sql = string.Format(@"	SELECT d.Id,d.DocumentArchiveId, d.BorrowType, d.ReturnStatus, do.DocCode, do.Abstract, do.DocTypeId, ca.Name as DocName
                from esto.DocOfRequest d
	            left join esto.Registrasionlist r on r.Id = d.RegistrasionlistId
                left join esto.DocumentArchive do on do.Id = d.DocumentArchiveId
                left join dbo.Catalog ca on ca.Id = do.DoctypeId
	            where d.RegistrasionlistId= {0}", id);

            model.DocRequests = _respository.GetListBySqlQuery<DocofrequestModel>(sql, new { });
            return model;
        }





        public IEnumerable<DocumentArchiveModel> GetByIDListView(int id)
        {
            var lst = _respository.GetListByStore<DocumentArchiveModel>("[esto].Prc_GetbyIdListView_List", new { Id = id });

            return lst;
        }


        public DocumentArchiveModel GetByIDDocView(long id)
        {
            return _respository.GetObjectByStore<DocumentArchiveModel>("[esto].Prc_GetbyIdDocView", new { Id = id });
        }

        public IEnumerable<ListModel> GetAllStaff()
        {
            var lst = _respository.GetListByStore<ListModel>("esto.[Prc_GetRegistrasionlistStaff]");

            return lst;
        }
        public IEnumerable<DocofrequestModel> GetByID_List(long id)
        {
            var lst = _respository.GetListByStore<DocofrequestModel>("esto.Prc_GetById_List", new { Id = id });

            return lst;
        }

        public Response UpdateAddinformation(DocofrequestModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.ReceiverName,
                entry.ReceiveDate,
                entry.ReceiveStatus,
                entry.LenderId,
                entry.ReceiveNote

            };
            var response = _respository.GetObjectByStore<Response>("[esto].Prc_AddinformationUpdate", arg);
            return response;
        }


    }

}
