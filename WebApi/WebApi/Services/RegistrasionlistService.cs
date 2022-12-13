using DocumentFormat.OpenXml.Drawing.Charts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using WebApi.Models;
using WebApi.Models.Base.esto;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{
    public interface IRegistrasionlistService
    {
        IEnumerable<RegistrasionlistModel> GetAllRegistrasionlist();
        //IEnumerable<RecordModel> GetAllFileCode();
        IEnumerable<RegistrasionlistModel> GetAllAttachmentOfDocument();
        IEnumerable<RecordModel> GetAllFileCode();

        IEnumerable<FondModel> GetAllFondName();
        Response DeleteRegis(RegistrasionlistModel entry);
        IEnumerable<RegistrasionlistModel> uploadFinished();
        PagedData<RegistrasionlistModel> GetByPageAll(GetByPageRequest request);
        PagedData<RegistrasionlistModel> GetByPage(GetByPageRequest request);

        Response Create(RegistrasionlistModel entry);
        Response Update(RegistrasionlistModel entry);

        Response CreateReturnRecord(RegistrasionlistModel entry);
        Response ChangeRegistrasionlist(RegistrasionlistModel entry);
        Response CreateRenewalProfile(RegistrasionlistModel entry);


        RegistrasionlistModel GetByID(int id);

        RegistrasionlistModel GetByRegistrasionID(int id);
        IEnumerable<FondModel> GetFondDepartment(int id);
        IEnumerable<DocofrequestModel> GetByIDList(int id);
        IEnumerable<DocofrequestModel> GetByIDList_Regis(int id);
        IEnumerable<DocofrequestModel> GetByIDListPayRecord(int id);

        Response UpdateRenewalProfile(RegistrasionlistModel entry);
        Response Delete(int id);
        Response RowSelectionChangeLog(RegistrasionlistModel model);
        Response GetRecordByUnitRenewalprofile(RegistrasionlistModel model);
        IEnumerable<RecordModel> GetRecordByUnit(int id);
        Response CreateList(RegistrasionlistModel model);
        Response UpdateList(RegistrasionlistModel model);
        Response CreateBrowing(RegistrasionlistModel model);
        Response UpdateBrowing(RegistrasionlistModel model);
        IEnumerable<DocumentArchiveModel> GetByRegistrasionlistId(int id);


    }
    public class RegistrasionlistService : IRegistrasionlistService
    {
        private readonly ICommonRepository _respository;

        public RegistrasionlistService(ICommonRepository respository)
        {
            _respository = respository;
        }

        public IEnumerable<RegistrasionlistModel> GetAllFond()
        {
            var registrasionlist = _respository.GetListByStore<RegistrasionlistModel>("dbo.[Prc_RegistrasionlistGetAll]", new { });

            return registrasionlist;
        }

        public PagedData<RegistrasionlistModel> GetByPageAll(GetByPageRequest request)
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
                    case "Id":
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
FROM [esto].[Registrasionlist] c
WHERE 1 = 1" + sqlwhere +
        @"

SELECT @count AS TotalRowCount,
        c.*,concat ( s.FirstName,' ',s.LastName) as FullName,
e.Title, c.Votes
FROM [esto].[Registrasionlist] c
left join acc.Staff s on s.Id = c.RegisterUser
left join esto.Record e on c.RecordId = e.Id
WHERE 1 = 1 and c.Status = 0 or c.Status = 1 or c.Status = 2 or c.Status = 6 or c.Status = 8 or c.Status = 7 or c.Status = 4" + sqlwhere +
    @" 

                    ORDER BY  " + SortFile + request.SortDirection + @"
                    OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
                ";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<RegistrasionlistModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RegistrasionlistModel>(list, rows, request.PageSize, request.PageIndex);
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
                request.SortDirection,
                intId = request.intId,
                DateAddStart = request.DateAddStart,
                DateAddEnd = request.DateAddEnd
            };
            var sqlwhere = "";

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND (c.Id Like '%' + @Keyword + '%' OR r.Votes LIKE '%' + @Keyword + '%' )";
            }
            if (request.DateAddStart != "" && request.DateAddStart != null)
            {
                sqlwhere += " AND ReimburseDate >= @DateAddStart";
            }
            if (request.DateAddEnd != "" && request.DateAddEnd != null)
            {
                sqlwhere += " AND (ReimburseDate between @DateAddStart and @DateAddEnd  )";
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
                    case "Id":
                        {
                            SortFile = " c.Id ";
                            break;
                        }
                    case "Votes":
                        {
                            SortFile = " r.Votes ";
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
WHERE 1 = 1 and r.Status = 6 or r.Status = 4 " + sqlwhere +
    @" 
    ORDER BY  " + SortFile + request.SortDirection + @"
           
";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<RegistrasionlistModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RegistrasionlistModel>(list, rows, request.PageSize, request.PageIndex);
        }


        public RegistrasionlistModel GetByID(int id)
        {
            return _respository.GetObjectByStore<RegistrasionlistModel>("[esto].[Prc_RegistrasionlistViewId]", new { Id = id });
        }

        public Response ChangeRegistrasionlist(RegistrasionlistModel entry)
        {
            var arg = new
            {
                entry.Id,
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_RegistrasionlistChange]", arg);
            return response;
        }

        public Response CreateReturnRecord(RegistrasionlistModel entry)
        {
            var arg = new
            {
                entry.UnitId,
                entry.CreatedUserId,
                entry.Name,
                entry.Notice
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_returnrecordinsert]", arg);
            return response;
        }

        public Response CreateRenewalProfile(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                 new XElement("AgreeStatus", j.AgreeStatus)))
                );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_UpdateRenewalprofile]",
                new
                {
                    entry.Id,
                    entry.Votes,
                    entry.RegisterUser,
                    entry.RecordId,
                    entry.BorrowDate,
                    entry.AppointmentDate,
                    entry.ExtendDate,
                    ModifiedUserId = entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }
        public Response UpdateRenewalProfile(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                 new XElement("Id", j.Id),
                 new XElement("ExtendDate", j.ExtendDate)
))
                );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_UpdateRenewalprofile]",
                new
                {
                    entry.Id,
                    entry.Status,
                    DocRequests = assets.ToString()
                });
            return response;
        }
        public Response CreateList(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                 new XElement("DocumentArchiveId", j.DocumentArchiveId),
                 new XElement("AgreeStatus", j.AgreeStatus),
                 new XElement("BrowsingStatus", j.BrowsingStatus)))
                );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_ListUpdate]",
                new
                {
                    entry.Id,
                    entry.Votes,
                    entry.RegisterUser,
                    entry.Referral,
                    entry.SendingPlace,
                    entry.DecisionFile,
                    entry.UnitId,
                    entry.CardId,
                    entry.FondId,
                    entry.RecordId,
                    entry.AppointmentDate,
                    entry.BorrowDate,
                    ModifiedUserId = entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }
        public Response CreateBrowing(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                 new XElement("DocumentArchiveId", j.DocumentArchiveId),
                 new XElement("AgreeStatus", j.AgreeStatus)))
                );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_BrowsingUpdate]",
                new
                {
                    entry.Id,
                    entry.Votes,
                    entry.RegisterUser,
                    entry.Referral,
                    entry.SendingPlace,
                    entry.DecisionFile,
                    entry.UnitId,
                    entry.CardId,
                    entry.FondId,
                    entry.RecordId,
                    entry.AppointmentDate,
                    entry.BorrowDate,
                    entry.BrowsingStatus,
                    ModifiedUserId = entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }
        public Response UpdateBrowing(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                 new XElement("DocumentArchiveId", j.DocumentArchiveId),
                 new XElement("AgreeStatus", j.AgreeStatus)))
                );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_BrowsingUpdate]",
                new
                {
                    entry.Id,
                    entry.Votes,
                    entry.RegisterUser,
                    entry.Referral,
                    entry.SendingPlace,
                    entry.DecisionFile,
                    entry.UnitId,
                    entry.CardId,
                    entry.FondId,
                    entry.RecordId,
                    entry.AppointmentDate,
                    entry.BorrowDate,
                    entry.BrowsingStatus,
                    ModifiedUserId = entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }
        public Response UpdateList(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                 new XElement("BorrowType", j.BorrowType)))
                );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_ListUpdate]",
                new
                {
                    entry.Id,
                    entry.Votes,
                    entry.RegisterUser,
                    entry.Referral,
                    entry.SendingPlace,
                    entry.DecisionFile,
                    entry.UnitId,
                    entry.CardId,
                    entry.FondId,
                    entry.RecordId,
                    entry.AppointmentDate,
                    entry.BorrowDate,
                    ModifiedUserId = entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }
        public Response Create(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                new XElement("DocumentArchiveId", j.DocumentArchiveId),
                new XElement("BorrowType", j.BorrowType)

                )));
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_ListSave_Regislist]",
                new
                {
                    entry.Votes,
                    entry.RegisterUser,
                    entry.Referral,
                    entry.SendingPlace,
                    entry.DecisionFile,
                    entry.UnitId,
                    entry.CardId,
                    entry.FondId,
                    entry.RecordId,
                    entry.AppointmentDate,
                    entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }
        public Response Update(RegistrasionlistModel entry)
        {
            var assets = new XElement("DocRequests", entry.DocRequests?.Select(j => new XElement("DocList",
                new XElement("DocumentArchiveId", j.DocumentArchiveId),
                new XElement("BorrowType", j.BorrowType)


                ))
               );
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_Regislist_Update]",
                new
                {
                    entry.Id,
                    entry.Votes,
                    entry.RegisterUser,
                    entry.Referral,
                    entry.SendingPlace,
                    entry.DecisionFile,
                    entry.UnitId,
                    entry.CardId,
                    entry.FondId,
                    entry.RecordId,
                    entry.AppointmentDate,
                    ModifiedUserId = entry.CreatedUserId,
                    DocRequests = assets.ToString()
                });
            return response;
        }



        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_RegistrasionlistDelete]", arg);
            return response;
        }


        public Response RowSelectionChangeLog(RegistrasionlistModel entry)
        {
            var ListRegistrasionlist_Cancel = string.Join(',', entry.ListRegistrasionlist_Cancel);
            var arg = new
            {
                ListRegistrasionlist_Cancel = ListRegistrasionlist_Cancel
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_RowSelectionChangeLog]", arg);
            return response;
        }

        public Response GetRecordByUnitRenewalprofile(RegistrasionlistModel entry)
        {
            var ListRegistrasionlist = string.Join(',', entry.ListRegistrasionlist);
            var arg = new
            {
                ListRegistrasionlist = ListRegistrasionlist
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_RowSelectionChangeLogRenewalprofile]", arg);
            return response;
        }


        public IEnumerable<RegistrasionlistModel> GetAllRegistrasionlist()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<RecordModel> GetAllFileCode()
        {
            var lst = _respository.GetListByStore<RecordModel>("esto.[Prc_Registrasionlist_getAllFilecode]");

            return lst;
        }


        public IEnumerable<DocumentArchiveModel> GetByRegistrasionlistId(int id)
        {
            var lst = _respository.GetListByStore<DocumentArchiveModel>("[esto].Prc_Registrasionlist_recordGetById", new { Id = id });

            return lst;
        }

        public RegistrasionlistModel GetByRegistrasionID(int id)
        {
            var model = _respository.GetObjectByStore<RegistrasionlistModel>("[esto].Prc_RegisId", new { Id = id });

            var sql = string.Format(@"	SELECT d.Id,d.DocumentArchiveId, d.BorrowType, do.DocCode, do.Abstract, do.DocTypeId,
                                                    do.BrowsingStatus,
                ca.Name as DocName from esto.DocOfRequest d
	            left join esto.Registrasionlist r on r.Id = d.RegistrasionlistId
                left join esto.DocumentArchive do on do.Id = d.DocumentArchiveId
                left join dbo.Catalog ca on ca.Id=do.DocTypeId
	            where d.RegistrasionlistId= {0}", id);

            model.DocRequests = _respository.GetListBySqlQuery<DocofrequestModel>(sql, new { });
            return model;
        }

        public IEnumerable<FondModel> GetAllFondName()
        {
            var lst = _respository.GetListByStore<FondModel>("esto.[Prc_Registrasionlist_getAllFondId]");

            return lst;
        }

        public IEnumerable<RegistrasionlistModel> uploadFinished()
        {
            var lst = _respository.GetListByStore<RegistrasionlistModel>("esto.[Registrasionlist_UploadFile]");
            return lst;
        }


        public IEnumerable<RecordModel> GetRecordByUnit(int id)
        {
            var lst = _respository.GetListByStore<RecordModel>("esto.[Prc_GetRecordByUnit]", new { Id = id });

            return lst;
        }



        public IEnumerable<FondModel> GetFondDepartment(int id)
        {
            var lst = _respository.GetListByStore<FondModel>("esto.[Prc_GetFondDepartment]", new { Id = id });

            return lst;
        }

        public FondModel GetById(int id)
        {
            return _respository.GetObjectByStore<FondModel>("[esto].Prc_RegistrasionlistGetById", new { Id = id });
        }


        public IEnumerable<DocofrequestModel> GetByIDList(int id)
        {
            var lst = _respository.GetListByStore<DocofrequestModel>("esto.Prc_RegistrasionlistGetByIdList", new { Id = id });

            return lst;
        }
        public IEnumerable<DocofrequestModel> GetByIDList_Regis(int id)
        {
            var lst = _respository.GetListByStore<DocofrequestModel>("esto.Prc_GetByIdList_Regis", new { Id = id });

            return lst;
        }
        public IEnumerable<DocofrequestModel> GetByIDListPayRecord(int id)
        {
            var lst = _respository.GetListByStore<DocofrequestModel>("esto.Prc_RegistrasionlistGetByIdListRecord", new { Id = id });

            return lst;
        }

        public IEnumerable<RegistrasionlistModel> GetAllAttachmentOfDocument()
        {
            var lst = _respository.GetListByStore<RegistrasionlistModel>("esto.[Prc_GetRegistrasionlistStaff]");

            return lst;
        }

        public Response DeleteRegis(RegistrasionlistModel entry)
        {
            var arg = new
            {
                Id = entry.Id
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_DeleteRegis]", arg);
            return response;
        }



    }
}
