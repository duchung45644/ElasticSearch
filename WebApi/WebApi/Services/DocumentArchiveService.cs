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
    public interface IDocumentArchiveService
    {
        Response Create(DocumentArchiveModel entry);
        Response Update(DocumentArchiveModel entry);
        PagedData<DocumentArchiveModel> GetByPage(GetByPageRequest request);
        Response Delete(DocumentArchiveModel entry);
        DocumentArchiveModel GetById(long id);
        DocumentArchiveModel GetByRecordId(long id);
    }
    public class DocumentArchiveService : IDocumentArchiveService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public DocumentArchiveService(ICommonRepository respository)
        {
            _respository = respository;
        }
        public Response Create(DocumentArchiveModel entry)
        {
            var apvs = new XElement("AttachmentOfDocumentArchives", entry.attachmentOfDocumentArchives?.Select(i => new XElement("AttachmentOfDocumentArchive",
                            new XElement("Id", i.Id),
                            new XElement("DocumentArchiveId", i.DocumentArchiveId),
                            new XElement("FileName", i.FileName),
                            new XElement("FilePath", i.FilePath),
                            new XElement("Extension", i.FilePath.Split('.')[i.FilePath.Split('.').Length - 1])
                        )));
            var arg = new
            {
                entry.DocCode,
                entry.Abstract,
                entry.DocOrdinal,
                entry.DocTypeId,
                entry.Number,
                entry.PublishUnitName,
                entry.UnitId,
                entry.RecordId,
                entry.Format,
                entry.ExpiredDate,
                entry.IsDocumentOriginal,
                entry.CreatedUserId,
                Attachments = apvs.ToString()
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_DocumentArchiveInsert]", arg);
            return response;
        }

        public Response Update(DocumentArchiveModel entry)
        {
            var apvs = new XElement("AttachmentOfDocumentArchives", entry.attachmentOfDocumentArchives?.Select(i => new XElement("AttachmentOfDocumentArchive",
                new XElement("Id", i.Id),
                new XElement("DocumentArchiveId", i.DocumentArchiveId),
                new XElement("FileName", i.FileName),
                new XElement("FilePath", i.FilePath),
                new XElement("Extension", i.FilePath.Split('.')[i.FilePath.Split('.').Length - 1])
            )));

            var arg = new
            {
                entry.Id,
                entry.DocCode,
                entry.Abstract,
                entry.DocOrdinal,
                entry.DocTypeId,
                entry.Number,
                entry.PublishUnitName,
                entry.UnitId,
                entry.RecordId,
                entry.Format,
                entry.ExpiredDate,
                entry.IsDocumentOriginal,
                ModifiedUserId = entry.CreatedUserId,
                Attachments = apvs.ToString()
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_DocumentArchiveUpdate]", arg);
            return response;
        }

        public PagedData<DocumentArchiveModel> GetByPage(GetByPageRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                RecordId = request.RecordId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";
            if (request.RecordId != 0)
            {
                sqlwhere += " AND  ( d.RecordId = @RecordId ) ";
            }
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( d.Abstract LIKE '%' + @Keyword + '%' ) ";
            }
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = " desc ";
            }
            var SortField = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortField = " d.DocOrdinal ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "Abstract":
                        {
                            SortField = " d.Abstract ";
                            break;
                        }
                    case "DocCode":
                        {
                            SortField = " d.DocCode ";
                            break;
                        }
                    default:
                        SortField = " d.Id ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
                    @PageLowerBound INT;
            SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
            SELECT @count = COUNT(1)
            FROM [esto].[DocumentArchive] d
            WHERE 1 = 1" + sqlwhere +
                 @" 
  
            SELECT @count AS TotalRowCount,
            d.*,c.ConditionName
            FROM [esto].[DocumentArchive] d 
            left join dbo.Condition c on d.Format = c.Id 
            WHERE 1 = 1" + sqlwhere +
                 @" 
    
                ORDER BY " + SortField + request.SortDirection + @"
			             OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
             ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<DocumentArchiveModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<DocumentArchiveModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public Response Delete(DocumentArchiveModel entry)
        {
            var List = string.Join(",", entry.documentArchiveList);

            var arg = new
            {
                documentArchiveLists = List
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_DocumentArchiveDelete]", arg);
            return response;
        }

        public DocumentArchiveModel GetById(long id)
        {
            var model =  _respository.GetObjectByStore<DocumentArchiveModel>("[esto].[Prc_DocumentArchiveGetById]", new { Id = id });
            var sql = string.Format(@"		SELECT Id
			  ,DocumentArchiveId
			  ,FileName
			  ,FilePath
			  ,FileSize
			  ,Extension
			  ,CreatedUserId
			  ,CreatedDate
		    FROM esto.AttachmentOfDocumentArchive
		    WHERE DocumentArchiveId = {0}", id);
                model.attachmentOfDocumentArchives = _respository.GetListBySqlQuery<AttachmentOfDocumentArchiveModel>(sql, new { });
            
            return model;

        }

        public DocumentArchiveModel GetByRecordId(long id)
        {
            var respoone = _respository.GetObjectByStore<DocumentArchiveModel>("[esto].[Prc_GetByRecordId]", new { Id = id});
            return respoone;
        }

    }
}
