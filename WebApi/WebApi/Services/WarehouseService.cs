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
    
    public interface IWarehouseService
    {
        
        IEnumerable<WarehouseModel> GetAllWarehouse();
        Response Create(WarehouseModel entry);
        WarehouseModel GetWarehouseById(int id);
        Response Update(WarehouseModel entry);
        Response Delete(int id);
         IEnumerable<WarehouseModel> GetAllCategory();
        IEnumerable<WarehouseModel> GetAllWarehouseByUnitId(int id);
        PagedData<ShelfModel> GetByPage(GetByPageRequest request);


    }
    public class WarehouseService : IWarehouseService
    {
        
        private readonly ICommonRepository _respository;

        public WarehouseService(ICommonRepository respository)
        {
            _respository = respository;
        }

        public PagedData<ShelfModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
               
                WarehouseId = request.WarehouseId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";
            
           
            if (request.WarehouseId > 0)
            {
                sqlwhere += " and c.WarehouseId = @WarehouseId ";
            }
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.ShelfName LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
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
                    case "ShelfName":
                        {
                            SortField = " c.ShelfName ";
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
FROM [dbo].[Shelf] c
WHERE 1 = 1 " + sqlwhere +
    @"  
  
SELECT @count AS TotalRowCount,

       c.*,
         w.CateName as ShelfTypeName ,b.Name as WarehouseName
       
     
FROM [dbo].[Shelf] c
  
   left join esto.Warehouse b on b.Id=c.WarehouseId
full JOIN dbo.Category w
        ON w.CategoryId = c.ShelfTypeId
    
		where 1=1  and c.ShelfTypeId=w.CategoryId " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<ShelfModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<ShelfModel>(list, rows, request.PageSize, request.PageIndex);
        }
        public IEnumerable<WarehouseModel> GetAllWarehouse()
        {
            var warehouses = _respository.GetListByStore<WarehouseModel>("[esto].[Prc_WarehouseGetAll]", new { });

            return warehouses;
        }

        

        public WarehouseModel GetWarehouseById(int id)
        {
            return _respository.GetObjectByStore<WarehouseModel>("[esto].[Prc_WarehouseGetById]", new { Id = id });
        }

       


        public Response Create(WarehouseModel entry)
        {
           
            var arg = new
            {

               entry.UnitId,
                entry.TypeId,
                entry.Code,
                entry.Name,
                entry.Address,
                entry.PhoneNumber,
                entry.Status,
                entry.Description,
                entry.SortOrder,
                entry.IsUnit,
                entry.AllowDocBook,

                entry.ParentId,
               


                UserId = entry.CreatedUserId


            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_WarehouseInsert]", arg);
            return response;
        }

        

        public Response Update(WarehouseModel entry)
        {
           
            var arg = new
            {
                entry.Id,
                entry.UnitId,

                entry.TypeId,
                entry.Code,
                entry.Name,
                entry.Address,
                entry.PhoneNumber,
                entry.Status,
                entry.Description,
                entry.SortOrder,
                entry.IsUnit,
                entry.AllowDocBook,



            
                entry.ParentId,

                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_WarehouseUpdate]", arg);
            return response;
        }

    
        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id 
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_WarehouseDelete]", arg);
            return response;
        }

        public IEnumerable<WarehouseModel> GetAllCategory()
        {
            var warehouse = _respository.GetListByStore<WarehouseModel>("[esto].[Prc_Warehouse_getAllCategory]", new { });

            return warehouse;
        }
        public IEnumerable<WarehouseModel> GetAllWarehouseByUnitId(int id)
        {
            var warehouses = _respository.GetListByStore<WarehouseModel>("[esto].[Prc_WarehouseGetByUnitId]", new { UnitId = id });

            return warehouses;
        }
    }
}

