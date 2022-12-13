using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface ICommuneService
    {
        IEnumerable<CommuneModel> GetAllCommune();
        PagedData<CommuneModel> GetByPage(GetByPageRequest request);
        IEnumerable<CommuneModel> GetByDistrict(int districtId);
        IEnumerable<DistrictModel> GetDistrictByProvice(int proviceId);
        Response Create(CommuneModel entry);
        CommuneModel GetCommuneById(int id);
        Response Update(CommuneModel entry);
        Response Delete(int id);
    }
    public class CommuneService : ICommuneService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public CommuneService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<CommuneModel> GetAllCommune()
        {
            var communes = _respository.GetListByStore<CommuneModel>("dbo.[Prc_CommuneGetAll]", new { });

            return communes;
        }

        public PagedData<CommuneModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
            }
            var arg = new
            {
                DistrictId = request.DistrictId,
                ProvinceId = request.ProvinceId,
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";

            if (request.DistrictId != 0)
            {
                sqlwhere += " and c.DistrictId = @DistrictId  ";
            }

            if (request.ProvinceId != 0)
            {
                sqlwhere += " and c.ProvinceId = @ProvinceId ";
            }


            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.Name LIKE '%' + @Keyword + '%' OR c.Code LIKE '%' + @Keyword + '%'   ) ";
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

                    case "DistrictName":
                        {
                            SortField = " d.Name ";
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
FROM [dbo].[Commune] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*,
       d.Name AS DistrictName,
       p.Name AS ProvinceName
FROM [dbo].[Commune] c
    LEFT JOIN dbo.District d
        ON d.Id = c.DistrictId
    LEFT JOIN dbo.Province p
        ON p.Id = d.ProvinceId
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<CommuneModel>(sql, arg);
            // var list = _respository.GetListByStore<CommuneModel>("[dbo].[Proc_SelectPaged_Commune]", arg);
            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<CommuneModel>(list, rows, request.PageSize, request.PageIndex);
        }
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public CommuneModel GetCommuneById(int id)
        {
            return _respository.GetObjectByStore<CommuneModel>("[dbo].Prc_CommuneGetById", new { Id = id });
        }

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(CommuneModel entry)
        {
            var arg = new
            {
                entry.Code,
                entry.Name,
                entry.ProvinceId,
                entry.DistrictId,
                entry.IsLocked,
                entry.Desciption,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_CommuneInsert]", arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(CommuneModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.Code,
                entry.Name,
                entry.ProvinceId,
                entry.DistrictId,
                entry.IsLocked,
                entry.Desciption,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CommuneUpdate]", arg);
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
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CommuneDelete]", arg);
            return response;
        }



        public IEnumerable<CommuneModel> GetByDistrict(int districtId)
        {
            var communes = _respository.GetListByStore<CommuneModel>("dbo.[Prc_CommuneGetByDistrict]", new { DistrictId = districtId });

            return communes;
        }

        public IEnumerable<DistrictModel> GetDistrictByProvice(int proviceId)
        {
            var lst = _respository.GetListByStore<DistrictModel>("dbo.[Prc_District_GetByProvice]", new { Id = proviceId });

            return lst;
        }
    }
}

