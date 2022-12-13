using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;


namespace WebApi.Services
{
    public interface IDocofrequestService
    {
        IEnumerable<DocofrequestModel> GetAll();
        Response Delete(DocofrequestModel model);
        Response DocofrequestDelete(int id);
        PagedData<DocofrequestModel> GetByPage(GetByPageRequest request);
        //DocofrequestModel GetByID(int id);
        RegistrasionlistModel GetByID(int id);
        Response CreateDocofrequest(DocofrequestModel entry);
        Response UpdateDocofrequest(DocofrequestModel entry);

    }

    public class DocofrequestService : IDocofrequestService
    {
        private readonly ICommonRepository _respository;

        public DocofrequestService(ICommonRepository respository)
        {
            _respository = respository;
        }

        public IEnumerable<DocofrequestModel> GetAll()
        {
            var sql = string.Format(@"SELECT * FROM esto.DocOfRequest");
            var respone = _respository.GetListBySqlQuery<DocofrequestModel>(sql, new { });
            return respone;
        }


        public PagedData<DocofrequestModel> GetByPage(GetByPageRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {


                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection,
                DateAddStart = request.DateAddStart,
                DateAddEnd = request.DateAddEnd
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
left join esto.Registrasionlist r on c.RegistrasionlistId = r.Id 
WHERE 1 = 1  " + sqlwhere +
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
r.RegisterUser,
CONCAT (s.LastName , s.FirstName) as FullName
FROM [esto].[Docofrequest] c 
left join esto.Registrasionlist r on c.RegistrasionlistId = r.Id 
left join esto.Record d on r.RecordId=d.Id
left join acc.Staff s on s.Id = r.CreatedUserId
WHERE 1 = 1 and r.Status = 6 " + sqlwhere +
    @" 
    ORDER BY  " + SortFile + request.SortDirection + @"
           
";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<DocofrequestModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<DocofrequestModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public RegistrasionlistModel GetByID(int id)
            {
            var model = _respository.GetObjectByStore<RegistrasionlistModel>("[esto].[Prc_RegisId]", new { Id = id });
            model.DocRequests = _respository.GetListByStore<DocofrequestModel>("[esto].[Prc_GetDocumentByRegistrationId]", new { Id = id });

            return model;

        }
        public IEnumerable<DocofrequestModel> GetByRegistrasionlistId(int id)
        {
            var lst = _respository.GetListByStore<DocofrequestModel>("[esto].Prc_DocofrequestGetById", new { Id = id });

            return lst;
        }
        public Response DocofrequestDelete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_DocofrequestDelete]", arg);
            return response;
        }
        public Response Delete(DocofrequestModel entry)
        {
            var ListDocofrequest = string.Join(',', entry.ListDocofrequest);
            var arg = new
            {
                ListDocofrequest = ListDocofrequest
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_DeleteDocofrequest]", arg);
            return response;
        }
        public Response CreateDocofrequest(DocofrequestModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.ReCordId,
                entry.RegistrasionlistId,
                entry.BorrowType
            };
            var response = _respository.GetObjectByStore<Response>("[esto].Prc_DocofrequestInsert", arg);
            return response;
        }

        public Response UpdateDocofrequest(DocofrequestModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.ReCordId,
                entry.RegistrasionlistId,
                entry.BorrowType

            };
            var response = _respository.GetObjectByStore<Response>("[esto].Prc_DocofrequestUpdate", arg);
            return response;
        }


    }

}
