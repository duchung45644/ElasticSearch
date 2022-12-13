using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IBoxService
    {
        //IEnumerable<BoxModel> GetAllBox();
        //PagedData<BoxModel> GetByPage(GetByPageRequest request);

        Response Create(BoxModel entry);
        BoxModel GetBoxById(int id);
        Response Update(BoxModel entry);
        Response Delete(int id);
        IEnumerable<BoxModel> GetAllCategory();
        IEnumerable<BoxModel> GetByShelft(int Id);
        IEnumerable<BoxModel> GetAllBox();
        PagedData<RecordModel> GetByPageRecord(GetByPageRequest request);

    }
    public class BoxService : IBoxService
    {
       
        private readonly ICommonRepository _respository;

        public BoxService(ICommonRepository respository)
        {
            _respository = respository;
        }


         public IEnumerable<BoxModel> GetAllBox()
         {
             var boxs = _respository.GetListByStore<BoxModel>("[dbo].[Prc_BoxGetAll]", new { });

             return boxs;
         }
        public PagedData<RecordModel> GetByPageRecord(GetByPageRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                BoxId = request.BoxId,
                StorageStatus=request.StorageStatus,
                RecordId = request.RecordId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";
            if (request.CreatedUserId == 0 || request.CreatedUserId != 0)
            {
                sqlwhere += " AND  ( r.CreatedUserId = @CreatedUserId ) ";
            }
            if (request.StorageStatus == 0 || request.StorageStatus != 0)
            {
                sqlwhere += " AND  ( r.StorageStatus = 1 ) ";
            }
            if (request.BoxId != 0)
            {
                sqlwhere += " AND  ( r.BoxId = @BoxId ) ";
            }
            if (request.RecordId != 0)
            {
                sqlwhere += " AND  ( r.RecordId = @RecordId ) ";
            }
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( r.Title LIKE '%' + @Keyword + '%' OR r.FileCode LIKE '%' + @Keyword + '%'   ) ";
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
            WHERE 1 = 1" + sqlwhere +
                 @" 
   SELECT @count AS TotalRowCount,
                   r.*,w.Name AS WareHouseName,c.Name AS MaintenanceName,ca.Name AS RightName
            FROM [esto].[Record] r left join esto.Warehouse w  on r.WareHouseId = w.Id
            left join dbo.Category c on r.Maintenance = c.CategoryId 
            left join dbo.Category ca on r.Rights = ca.CategoryId 
             left join acc.Staff s on s.Id=r.CreatedUserId
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

        public BoxModel GetBoxById(int id)
        {
            return _respository.GetObjectByStore<BoxModel>("[dbo].[Prc_BoxGetById]", new { Id = id });
        }


        public Response Create(BoxModel entry)
        {
            var arg = new
            {

                entry.ShelfId,
                entry.Code,
                entry.BoxName,

                entry.Capacity,
                entry.Tonnage,
                entry.Size,
                entry.SortOrder,
                entry.Description,
                entry.BoxId,

                entry.Status,
               
                UserId = entry.CreatedUserId

            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_BoxInsert]", arg);
            return response;
        }


        public Response Update(BoxModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.ShelfId,
                entry.Code,
                entry.BoxName,

                entry.Capacity,
                entry.Tonnage,
                entry.Size,
                entry.SortOrder,
                entry.Description,
                entry.BoxId,

                entry.Status,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_BoxUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_BoxDelete]", arg);
            return response;
        }


        /* public IEnumerable<BoxModel> GetAllCategory()
         {

           var sql = @" SELECT * FROM dbo.Category  where Code='LOAIHOP'";
           return _respository.GetListBySqlQuery<BoxModel>(sql, new {});

         }*/

        public IEnumerable<BoxModel> GetAllCategory()
        {
            var box = _respository.GetListByStore<BoxModel>("[dbo].[Prc_Box_getAllCategory]", new { });

            return box;
        }
        /* public IEnumerable<ShelfModel> GetAllWarehouse()
         {
             var shelf = _respository.GetListByStore<ShelfModel>("[dbo].[Prc_Shelf_getAllWarehouse]", new { });

             return shelf;
         }*/

        public IEnumerable<BoxModel> GetByShelft(int Id)
        {
            var shelf = _respository.GetListByStore<BoxModel>("[dbo].[Prc_GetBoxBySheft]", new { ShelfId = Id });

            return shelf;
        }



    }
}

