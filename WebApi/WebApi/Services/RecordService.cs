using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{
    public interface IRecordService
    {
        IEnumerable<RecordModel> GetAll();
        IEnumerable<CategoryModel> GetAllLanguage();
        IEnumerable<CategoryModel> GetAllRights();
        IEnumerable<CategoryModel> GetAllMaintenance();
        Response Create(RecordModel entry);
        Response Update(RecordModel entry);
        PagedData<RecordModel> GetByPage(GetByPageRequest request);
        RecordModel GetById(long id);
        Response Delete(RecordModel entry);
        RecordModel GetFileCodeByDepartment(int UnitId, int FileCatalog, string FileNotation);
        Response SaveFormativeRecord(RecordModel entry);
        Response LostRecord(RecordModel entry);
        Response WaitDestroyRecord(RecordModel entry);



        Response DeleteRecord(int id);
        Response CancelRecord(RecordModel entry);
        Response UpdateStorageStatus(int id);
        IEnumerable<AttachmentOfDocumentArchiveModel> GetExtention();

    }
    public class RecordService : IRecordService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public RecordService(ICommonRepository respository)
        {
            _respository = respository;
        }
        public IEnumerable<RecordModel> GetAll()
        {
            var record = _respository.GetListByStore<RecordModel>("[dbo].[Prc_RecordGetAll]", new { });

            return record;
        }
        public IEnumerable<RecordModel> GetAllRecordStatus2()
        {
            var record = _respository.GetListByStore<RecordModel>("[dbo].[Prc_Approve_getAllRecord]", new { });

            return record;
        }
       

        public IEnumerable<CategoryModel> GetAllLanguage()
        {
            var record = _respository.GetListByStore<CategoryModel>("[esto].[Prc_GetAllLanguage]", new { });

            return record;
        }
        public IEnumerable<CategoryModel> GetAllRights()
        {
            var rights = _respository.GetListByStore<CategoryModel>("[esto].[Prc_GetAllRights]", new { });

            return rights;
        }
        public IEnumerable<CategoryModel> GetAllMaintenance()
        {
            var maintenance = _respository.GetListByStore<CategoryModel>("[esto].[Prc_GetAllMaintenance]", new { });

            return maintenance;
        }
        public Response Create(RecordModel entry)
        {

            var arg = new
            {
                entry.UnitId,
                entry.FondId,
                entry.FileCode,
                entry.FileCatalog,
                entry.FileNotation,
                entry.Title,
                entry.Maintenance,
                entry.Rights,
                entry.Language,
                entry.RecordContent,
                entry.StartDate,
                entry.CompleteDate,
                entry.TotalDoc,
                entry.Description,
                entry.InforSign,
                entry.Keyword,
                entry.TotalPaper,
                entry.PageNumber,
                entry.Format,
                entry.ReceptionArchiveId,
                entry.InChargeStaffId,
                entry.WareHouseId,
                entry.ShelfId,
                entry.BoxId,
                entry.ReceptionFrom,
                entry.TransferStaff,
                entry.IsDocumentOriginal,
                entry.NumberOfCopy,
                entry.DocFileId,
                entry.Number,
                entry.TransferOnlineStatus,
                entry.OtherType,
                entry.Version,
                entry.CreatedUserId,
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RecordInsert]", arg);
            return response;
        }
        public Response Update(RecordModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.UnitId,
                entry.FondId,
                entry.FileCode,
                entry.FileCatalog,
                entry.FileNotation,
                entry.Title,
                entry.Maintenance,
                entry.Rights,
                entry.Language,
                entry.RecordContent,
                entry.StartDate,
                entry.CompleteDate,
                entry.TotalDoc,
                entry.Description,
                entry.InforSign,
                entry.Keyword,
                entry.TotalPaper,
                entry.PageNumber,
                entry.Format,
                entry.ReceptionArchiveId,
                entry.InChargeStaffId,
                entry.WareHouseId,
                entry.ShelfId,
                entry.BoxId,
                entry.ReceptionFrom,
                entry.TransferStaff,
                entry.IsDocumentOriginal,
                entry.NumberOfCopy,
                entry.DocFileId,
                entry.Number,
                entry.TransferOnlineStatus,
                entry.OtherType,
                entry.Version,
                ModifiedUserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_RecordUpdate]", arg);
            return response;
        }
        
        public PagedData<RecordModel> GetByPage(GetByPageRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                Status = request.Status,
                FileName = request.FileName,
                UnitId = request.UnitId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
          
           
            var sqlwhere = "";
            //if (!string.IsNullOrWhiteSpace(request.Extension))
            //{ 
            //    sqlwhere += " and ad.Extension= '"+ request.Extension + "' ";
            //}
           
            if (request.UnitId != 1)
            {
                sqlwhere += " AND  ( r.UnitId = @UnitId ) ";
            }
           
            if (request.Status == 0 || request.Status != 0)
            {
                sqlwhere += " AND  ( r.Status = @Status ) ";
            }
           
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( r.Title LIKE '%' + @Keyword + '%' OR r.FileCode LIKE '%' + @Keyword + '%' OR ad.FileName LIKE '%' + @Keyword + '%'   ) ";
            }
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
             left join esto.DocumentArchive d on d.RecordId =r.Id 
            left join esto.AttachmentOfDocumentArchive ad on ad.DocumentArchiveId = d.Id
            WHERE 1 = 1" + sqlwhere +
                 @" 
  
            SELECT Distinct @count AS TotalRowCount, 
                   r.*,w.Name AS WareHouseName,c.Name AS MaintenanceName,ca.Name AS RightName,ad.Extension
            FROM [esto].[Record] r left join esto.Warehouse w  on r.WareHouseId = w.Id
            left join dbo.Category c on r.Maintenance = c.CategoryId 
            left join dbo.Category ca on r.Rights = ca.CategoryId 
             left join esto.DocumentArchive d on d.RecordId =r.Id 
            left join esto.AttachmentOfDocumentArchive ad on ad.DocumentArchiveId = d.Id
             
            WHERE 1 = 1  " + sqlwhere +
                 @" 
    
                ORDER BY " + SortField + request.SortDirection + @"
			             OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
             ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<RecordModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<RecordModel>(list, rows, request.PageSize, request.PageIndex);
        }
      

        public Response Delete(RecordModel entry)
        {
            var ListRecord = string.Join(",", entry.ListRecord);

            var arg = new
            {
                ListRecord = ListRecord
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_RecordDelete]", arg);
            return response;
        }

        public RecordModel GetFileCodeByDepartment(int UnitId, int FileCatalog, string FileNotation)
        {
            var response = _respository.GetObjectBySqlQuery<RecordModel>("SELECT [dbo].[Prc_GetFileCodeByDepartment] (" + UnitId + " , " + FileCatalog + ",'" + FileNotation + "' ) AS FileCode");
            return response;
        }

        public RecordModel GetById(long id)
        {
            return _respository.GetObjectByStore<RecordModel>("[esto].[Prc_RecordGetById]", new { Id = id });
        }

        public Response SaveFormativeRecord(RecordModel entry)
        {
            var arg = new
            {
                entry.Id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_SaveFormativeRecord]", arg);
            return response;
        }

        public Response LostRecord(RecordModel entry)
        {
            var ListRecord = string.Join(",", entry.ListRecord);

            var arg = new
            {
                ListRecord = ListRecord
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_LostRecord]", arg);
            return response;
        }

        public Response WaitDestroyRecord(RecordModel entry)
        {
            var ListRecord = string.Join(",", entry.ListRecord);

            var arg = new
            {
                ListRecord = ListRecord
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_ChangeStatusRecord]", arg);
            return response;
        }
        public Response CancelRecord(RecordModel entry)
        {
            var ListRecord = string.Join(",", entry.ListRecord);
      

            var arg = new
            {
                ListRecord = ListRecord,
                entry.ApproveId,
              
                
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_CancelRecord]", arg);
            return response;
        }
        public Response DeleteRecord(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_RecordDeletebyId]", arg);
            return response;
        }
        public Response UpdateStorageStatus(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_RecordUpdateStorageStatus]", arg);
            return response;
        }
        public IEnumerable<AttachmentOfDocumentArchiveModel> GetExtention()
        {
            var sql = @"SELECT Distinct Extension
  FROM [esto].[AttachmentOfDocumentArchive] ";
            return _respository.GetListBySqlQuery<AttachmentOfDocumentArchiveModel>(sql);
        }
    }
}
