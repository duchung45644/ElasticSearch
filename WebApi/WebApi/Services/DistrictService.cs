using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{
    public interface IDistrictService
    {

        IEnumerable<DistrictModel> GetAllDistrict();
        PagedData<DistrictModel> GetByPage(GetByPageRequest request);
     
        IEnumerable<DistrictModel> GetAllProvince(int proviceId);
        Response Create(DistrictModel entry);
        DistrictModel GetDistrictById(int id);
        Response Update(DistrictModel entry);
        Response Delete(int id);
    }
    public class DistrictService : IDistrictService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public DistrictService(ICommonRepository respository)
        {
            _respository = respository;
        }
        public IEnumerable<DistrictModel> GetAllDistrict()
        {
            var districts = _respository.GetListByStore<DistrictModel>("dbo.[Prc_DistrictGetAll]", new { });

            return districts;
        }

        public PagedData<DistrictModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                //DistrictId = request.DistrictId,
                ProvinceId = request.ProvinceId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";

            


            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.Name LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
            }
            if (request.ProvinceId > 0)
            {
                sqlwhere += " and c.ProvinceId = @ProvinceId ";
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
                    case "Code":
                        {
                            SortField = " c.Code ";
                            break;
                        }


                    case "ProvinceName":
                        {
                            SortField = " p.Name  ";
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
FROM [dbo].[District] c
WHERE 1 = 1 " + sqlwhere + 
     @" 
  
SELECT @count AS TotalRowCount,
       c.*,
         p.Name AS ProvinceName
       
     
FROM [dbo].[district] c
  
    LEFT JOIN dbo.Province p
        ON p.Id = c.ProvinceId
    
 
   
WHERE 1 = 1 " + sqlwhere +
     @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<DistrictModel>(sql, arg);

            // var list = _respository.GetListByStore<DistrictModel>("[dbo].[Proc_SelectPaged_District]", arg);
            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<DistrictModel>(list, rows, request.PageSize, request.PageIndex);
        }
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public DistrictModel GetDistrictById(int id)
        {
            return _respository.GetObjectByStore<DistrictModel>("[dbo].Prc_DistrictGetById", new { Id = id });
        }

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(DistrictModel entry)
        {
            var arg = new
            {
                entry.Code,
                entry.Name,
                //entry.DistrictId,
                entry.ProvinceId,
               // entry.VnPostCode,
                entry.IsLocked,
                entry.Desciption,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_DistrictInsert]", arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(DistrictModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.Code,
                entry.Name,
                //entry.DistrictId,
                entry.ProvinceId,
               // entry.VnPostCode,
                entry.IsLocked,
                entry.Desciption,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_DistrictUpdate]", arg);
            return response;
        }

        /// <summary>
        /// Delete the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_DistrictDelete]", arg);
            return response;
        }



     

        public IEnumerable<DistrictModel> GetAllProvince(int proviceId)
        {
            var lst = _respository.GetListByStore<DistrictModel>("dbo.[Prc_District_getAllProvince]", new { Id = proviceId });

            return lst;
        }
    }
}
