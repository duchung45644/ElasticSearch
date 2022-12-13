using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IShelfService
    {
        IEnumerable<ShelfModel> GetAllShelf();
        PagedData<BoxModel> GetByPage(GetByPageRequest request);

        Response Create(ShelfModel entry);
        ShelfModel GetShelfById(int id);
        Response Update(ShelfModel entry);
        Response Delete(int id);
        IEnumerable<ShelfModel> GetAllCategory();
        IEnumerable<ShelfModel> GetAllWarehouse(int WarehouseId);
        IEnumerable<ShelfModel> GetAllShelfByUnitId(GetByPageRequest request);



    }
    public class ShelfService : IShelfService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public ShelfService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<ShelfModel> GetAllShelf()
        {
            var shelfs = _respository.GetListByStore<ShelfModel>("[dbo].[Prc_ShelfGetAll]", new { });

            return shelfs;
        }

        public PagedData<BoxModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                
                ShelfId =request.ShelfId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";

            
            if (request.ShelfId > 0)
            {
                sqlwhere += " and c.ShelfId = @ShelfId ";
            }
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.BoxName LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
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
                    case "BoxName":
                        {
                            SortField = " c.BoxName ";
                            break;
                        }
                    case "Code":
                        {
                            SortField = " c.Code ";
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
FROM [dbo].[Box] c
WHERE 1 = 1 " + sqlwhere +
    @"  
  
SELECT @count AS TotalRowCount,

       c.*,
         w.CateName as BoxTypeName,s.ShelfName as ShelfNameBox    
       
     
FROM [dbo].[Box] c
  
    LEFT JOIN dbo.Shelf s
        ON c.ShelfId = s.Id
full JOIN dbo.Category w
        ON w.CategoryId = c.BoxId
    
		where 1=1 and w.Code='LOAIHOP'" + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @" 
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<BoxModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<BoxModel>(list, rows, request.PageSize, request.PageIndex);
        }


        public ShelfModel GetShelfById(int id)
        {
            return _respository.GetObjectByStore<ShelfModel>("[dbo].[Prc_ShelfGetById]", new { Id = id });
        }


        public Response Create(ShelfModel entry)
        {
            var arg = new
            {

                        entry.WarehouseId,
                        entry.Code,
                        entry.ShelfName,
                       
                        entry.Capacity,
                        entry.Tonnage,
                        entry.Size,
                        entry.SortOrder,
                        entry.Description,
                        
                        entry.Status,
                        entry.ParentId,
                        entry.UnitId,
                entry.ShelfTypeId,
                        UserId = entry.CreatedUserId

            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_ShelfInsert]", arg);
            return response;
        }


        public Response Update(ShelfModel entry)
        {
           
            var arg = new
            {
                entry.Id,
                entry.WarehouseId,
                entry.Code,
                entry.ShelfName,
              
                entry.Capacity,
                entry.Tonnage,
                entry.Size,
                entry.SortOrder,
                entry.Description,
              
                entry.Status,
                entry.ParentId,
                entry.UnitId,
                entry.ShelfTypeId,
               
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_ShelfUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_ShelfDelete]", arg);
            return response;
        }


        // public IEnumerable<ShelfModel> GetAllCategory()
       //  {

          //   var sql = @" SELECT * FROM dbo.Category  where Code='LOAIKHO'";
           //   return _respository.GetListBySqlQuery<ShelfModel>(sql, new {});

        // }

        public IEnumerable<ShelfModel> GetAllCategory()
        {
            var shelf = _respository.GetListByStore<ShelfModel>("[dbo].[Prc_Shelf_getAllCategory]", new { });

            return shelf;
        }
        /* public IEnumerable<ShelfModel> GetAllWarehouse()
         {
             var shelf = _respository.GetListByStore<ShelfModel>("[dbo].[Prc_Shelf_getAllWarehouse]", new { });

             return shelf;
         }*/
        public IEnumerable<ShelfModel> GetAllWarehouse(int WarehouseId)
        {
            var lst = _respository.GetListByStore<ShelfModel>("[dbo].[Prc_Shelf_getAllWarehouse]", new { WarehouseId = WarehouseId });

            return lst;
        }

        public IEnumerable<ShelfModel> GetAllShelfByUnitId(GetByPageRequest request)
        {
            return _respository.GetListByStore<ShelfModel>("[dbo].[Prc_ShelfGetAllByUnit]", new
            {
                request.WarehouseId,
                request.UnitId
            });
        }
    }
}

