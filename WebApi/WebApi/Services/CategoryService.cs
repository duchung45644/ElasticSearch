using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface ICategoryService
    {
        IEnumerable<CategoryModel> GetCategoryByCode(string code);
        IEnumerable<CategoryModel> GetAllCategory();
        IEnumerable<CategoryModel> GetCategoryByCodes(string code);
        IEnumerable<ProvinceModel> GetAllProvice();//viết giống cái này
        IEnumerable<DistrictModel> GetDistrictByProvice(int proviceId);

        IEnumerable<CommuneModel> GetCommuneByDistrict(int districtId);

        PagedData<CategoryModel> GetByPage(GetByPageRequest request);

        Response Create(CategoryModel entry);

        CategoryModel GetCategoryById(int id);
        Response Update(CategoryModel entry);
        Response Delete(int id);
    }
    public class CategoryService : ICategoryService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public CategoryService(ICommonRepository respository)
        {
            _respository = respository;
        }
        public IEnumerable<CategoryModel> GetAllCategory()
        {
            var categorys = _respository.GetListByStore<CategoryModel>("[dbo].[Prc_CategoryGetAll]", new { });

            return categorys;
        }
        public IEnumerable<ProvinceModel> GetAllProvice()        {
            var sql = @"SELECT  [Id]
      ,[Code]
      ,[Name]
      ,[Desciption]
      ,[IsLocked]
      ,[ModifiedUserId]
      ,[ModifiedDate]
      ,[CreatedUserId]
      ,[CreatedDate]
      ,[VnPostCode]
  FROM [dbo].[Province] WHERE IsLocked = 0  ORDER BY Code";
            return _respository.GetListBySqlQuery<ProvinceModel>(sql);
        }

        public IEnumerable<CategoryModel> GetCategoryByCode(string code)
        {
            var sql = @"SELECT  *   FROM [dbo].Category WHERE  Code = @Code";
            return _respository.GetListBySqlQuery<CategoryModel>(sql, new { Code = code });
        }
        public IEnumerable<CategoryModel> GetCategoryByCodes(string code)
        {
            var sql = $"SELECT  *   FROM [dbo].Category WHERE  Code IN ( {code})";
            return _respository.GetListBySqlQuery<CategoryModel>(sql, new { });
        }

        public IEnumerable<CommuneModel> GetCommuneByDistrict(int districtId)
        {

            var sql = @"SELECT  *   FROM [dbo].Commune  WHERE  IsLocked = 0  AND DistrictId = @DistrictId ORDER BY Code";
            return _respository.GetListBySqlQuery<CommuneModel>(sql, new { DistrictId = districtId });
        }

        public IEnumerable<DistrictModel> GetDistrictByProvice(int proviceId)
        {
            var sql = @"SELECT  *   FROM [dbo].District  WHERE  IsLocked = 0  AND ProvinceId = @ProvinceId ORDER BY Code";
            return _respository.GetListBySqlQuery<DistrictModel>(sql, new { ProvinceId = proviceId });
        }



        public PagedData<CategoryModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.Code))
            {
                request.Code = request.Code.Trim();
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



            if (!string.IsNullOrWhiteSpace(request.Code))
            {
                sqlwhere += " AND   c.Code ='"+ request.Code + "' ";
            }
            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.Name LIKE '%' + @Keyword + '%'  or c.Code LIKE '%' + @Keyword + '%' or c.CateName LIKE '%' + @Keyword + '%'   ) ";
            }
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = " desc ";
            }
            var SortField = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortField = " c.[Order] ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "Code":
                        {
                            SortField = " c.Code ";
                            break;
                        }
                    case "Name":
                        {
                            SortField = " c.Name ";
                            break;
                        }


                    default:
                        SortField = " c.[Order] ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
                        @PageLowerBound INT;
                SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
                SELECT @count = COUNT(1)
                FROM [dbo].[Category] c
                WHERE 1 = 1 " + sqlwhere +
                    @" 
  
                SELECT @count AS TotalRowCount,
                       c.*
                FROM [dbo].[Category] c
   
                WHERE 1 = 1 " + sqlwhere +
                    @"  ORDER BY " + SortField + request.SortDirection + @"	 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<CategoryModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<CategoryModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public CategoryModel GetCategoryById(int id)
        {
            return _respository.GetObjectByStore<CategoryModel>("[dbo].[Prc_CategoryGetById]", new { CategoryId = id });
        }


        public Response Create(CategoryModel entry)
        {
            var arg = new
            {
                entry.Code,
                entry.Name,
                entry.ParentId,
                entry.Order ,
                entry.CateName,
                entry.Value,
                UserId = entry.CreatedUserId
            };

            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_CategoryInsert", arg);
            return response;
        }

        public Response Update(CategoryModel entry)
        {
            var arg = new
            {
                entry.CategoryId,
                entry.Code,
                entry.Name,
                entry.ParentId,
                entry.Order,
                entry.CateName,
                entry.Value,
                UserId = entry.CreatedUserId,

            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CategoryUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                CategoryId = id
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CategoryDelete]", arg);
            return response;
        }

    }
}

