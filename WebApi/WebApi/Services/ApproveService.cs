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

    public interface IApproveService
    {
       
        PagedData<ApproveModel> GetByPage(GetByPageRequest request);
        PagedData<RecordModel> GetByPageRecord(GetByPageRequest request);
        Response UpdateApprove(ApproveModel entry);

        Response Create(ApproveModel entry);
        ApproveModel GetApproveById(int id);
        Response Update(ApproveModel entry);
        
        Response Delete(int id);
        IEnumerable<ApproveModel> GetAllApproveStatus0(int id);
        Response CancelRecordApprove(ApproveModel entry);
        IEnumerable<ApproveModel> GetAllApprove();
        IEnumerable<RecordModel> GetAllRecord(int id);
       
       
        IEnumerable<RecordModel> GetAllRecordStatus(int id,int status);
     
        Response DeleteRecordInApprove(RecordModel entry);
        IEnumerable<StaffModel> GetAllStaff();
        IEnumerable<RecordModel> ViewDetailRecordRefuse(int id);



    }
    public class ApproveService : IApproveService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public ApproveService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<StaffModel> GetAllStaff()
        {
            var staffs = _respository.GetListByStore<StaffModel>("[acc].[Prc_StaffGetAll]", new { });

            return staffs;
        }
        public IEnumerable<ApproveModel> GetAllApprove()
        {
            var approves = _respository.GetListByStore<ApproveModel>("[dbo].[Prc_ApproveGetAll]", new { });

            return approves;
        }
        public IEnumerable<ApproveModel> GetAllApproveStatus0(int id)
        {
            var approves = _respository.GetListByStore<ApproveModel>("[dbo].[Prc_ApproveGetAllStatus0]", new { Id=id});

            return approves;
        }
        public IEnumerable<RecordModel> GetAllRecord(int id)
        {
            var approves = _respository.GetListByStore<RecordModel>("[dbo].[Prc_ApproveGetAllRecord]", new {Id=id });

            return approves;
        }
      
        public IEnumerable<RecordModel> GetAllRecordStatus(int id,int status)
        {
            var approves = _respository.GetListByStore<RecordModel>("[dbo].[Prc_RecordGetAllStatus]", new { Id = id,Status=status });

            return approves;
        }
        public IEnumerable<RecordModel> ViewDetailRecordRefuse(int id)
        {
            var approves = _respository.GetListByStore<RecordModel>("[dbo].[Prc_ViewDetailRecordRefuse]", new { Id = id});

            return approves;
        }

        public ApproveModel GetApproveById(int id)
        {
            var model = _respository.GetObjectByStore<ApproveModel>("[dbo].[Prc_ApproveGetById]", new { Id = id });
            var sql = string.Format(@"		SELECT Id
			  ,ApproveAttId
			  ,FileName
			  ,FilePath
			  ,FileSize
			  ,Extension
			  ,CreatedUserId
			  ,CreatedDate
		    FROM dbo.AttachmentOfApprove
		    WHERE ApproveAttId = {0}", id);
            model.ListAttachment = _respository.GetListBySqlQuery<AttachmentOfApprove>(sql, new { });

            return model;
        }

        public PagedData<ApproveModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                Status = request.Status,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";

            if (request.Status == 0 || request.Status != 0)
            {
                sqlwhere += " AND  ( c.Status = @Status) ";
            }


            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.Name LIKE '%' + @Keyword + '%' OR c.Ctime LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
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
                    case "Name":
                        {
                            SortField = " c.Name ";
                            break;
                        }
                    case "Ctime":
                        {
                            SortField = " c.Ctime ";
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
FROM [dbo].[Approve] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*,concat ( s.FirstName,' ',s.LastName) as FullName
FROM [dbo].[Approve] c
left join acc.Staff s on s.Id = c.CreatedUserId
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<ApproveModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<ApproveModel>(list, rows, request.PageSize, request.PageIndex);
        }

      


        public Response Create(ApproveModel entry)
        {
            var attachment = new XElement("AttachmentOfApproves", entry.ListAttachment?.Select(i => new XElement("AttachmentOfApprove",
                            new XElement("Id", i.Id),
                            new XElement("ApproveAttId", i.ApproveAttId),
                            new XElement("FileName", i.FileName),
                            new XElement("FilePath", i.FilePath),
                            new XElement("Extension", i.FilePath.Split('.')[i.FilePath.Split('.').Length - 1])
                        )));
            var ListRecord = string.Join(",", entry.ListRecord);
            var arg = new
            {
                entry.Code,
                entry.Ctime,

                entry.Description,
                entry.Name,
                UserId = entry.CreatedUserId,
                ListAttachment = attachment.ToString(),
                ListRecord=ListRecord,
                entry.ApproveId



            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_ApproveInsert]", arg);
            return response;
        }


        public Response Update(ApproveModel entry)  
        {
            var attachment = new XElement("AttachmentOfApproves", entry.ListAttachment?.Select(i => new XElement("AttachmentOfApprove",
                          new XElement("Id", i.Id),
                          new XElement("ApproveAttId", i.ApproveAttId),
                          new XElement("FileName", i.FileName),
                          new XElement("FilePath", i.FilePath),
                          new XElement("Extension", i.FilePath.Split('.')[i.FilePath.Split('.').Length - 1])
                      )));
            var ListRecord = string.Join(",", entry.ListRecord);
            var arg = new
            {
                entry.Id,
                entry.Code,
                entry.Ctime,

                entry.Description,
                entry.Name,

                 UserId = entry.CreatedUserId,
                ListAttachment = attachment.ToString(),
                ListRecord = ListRecord,
                entry.ApproveId




            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_ApproveUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_ApproveDelete]", arg);
            return response;
        }
        public PagedData<RecordModel> GetByPageRecord(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                Status = request.Status,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                //ApproveId = request.ApproveId,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";

            if (request.Status == 0 || request.Status != 0)
            {
                sqlwhere += " AND  ( r.Status = 2 ) ";
            }
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( r.Title LIKE '%' + @Keyword + '%' OR r.FileCode LIKE '%' + @Keyword + '%'   ) ";
            }
            //if (request.ApproveId > 0)
            //{
            //    sqlwhere += " and r.ApproveId = @ApproveId ";
            //}
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = " desc ";
            }
            var SortField = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortField = " r.Id ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "Title":
                        {
                            SortField = " r.Title ";
                            break;
                        }
                    case "FileCode":
                        {
                            SortField = " r.FileCode ";
                            break;
                        }
                    default:
                        SortField = " r.Id ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
                    @PageLowerBound INT;
            SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
            SELECT @count = COUNT(1)
            FROM [esto].[Record] r 
            WHERE 1 = 1" + sqlwhere +
                 @" 
  
            SELECT @count AS TotalRowCount,
                   r.*,w.Name AS WareHouseName,a.Ctime as CancelTime,c.Name AS MaintenanceName,ca.Name AS RightName
            FROM [esto].[Record] r left join esto.Warehouse w  on r.WareHouseId = w.Id
                                       left join dbo.Approve a on r.ApproveId=a.Id
 left join dbo.Category c on r.Maintenance = c.CategoryId 
            left join dbo.Category ca on r.Rights = ca.CategoryId 
            WHERE 1 = 1" + sqlwhere +
                 @" 
    
                ORDER BY " + SortField + request.SortDirection + @"
			             OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
             ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<RecordModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RecordModel>(list, rows, request.PageSize, request.PageIndex);
        }
      
        public Response CancelRecordApprove(ApproveModel entry)
        {
            var ListRecord = string.Join(",", entry.ListRecord);


            var arg = new
            {
               entry.StaffId,
                ListRecord = ListRecord,
                entry.Id




            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_CancelRecordApprove]", arg);
            return response;
        }
    
        public Response UpdateApprove(ApproveModel entry)
        {
            var ListRecord = string.Join(",", entry.ListRecord);
            

            var arg = new
            {
                ListRecord = ListRecord,
                entry.Reason,
                entry.StaffIdRefuse,
                entry.Id
            
               


            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_UpdateApproveRecordStatus2]", arg);
            return response;
        }
        public Response DeleteRecordInApprove(RecordModel entry)
        {
            var ListRecord = string.Join(",", entry.ListRecord);

            var arg = new
            {
                ListRecord = ListRecord
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[DeleteRecordInApprove]", arg);
            return response;
        }

    }
}

