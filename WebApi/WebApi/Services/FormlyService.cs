using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IFormlyService
    {
        IEnumerable<FormlyModel> GetAllFormly();
        PagedData<FormlyModel> GetByPage(GetByPageRequest request);
        Response Create(FormlyModel entry);
        FormlyModel GetFormlyById(int id);
        FormlyModel GetFormlyByCode(string code);
        Response Update(FormlyModel entry);
        Response Delete(int id);
    }
    public class FormlyService : IFormlyService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public FormlyService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<FormlyModel> GetAllFormly()
        {
            var Formlys = _respository.GetListByStore<FormlyModel>("dbo.[Prc_FormlyGetAll]", new { });

            return Formlys;
        }

        public PagedData<FormlyModel> GetByPage(GetByPageRequest request)
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
FROM [dbo].[Formly] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*,
       d.Name AS DistrictName,
       p.Name AS ProvinceName
FROM [dbo].[Formly] c
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

            var list = _respository.GetListBySqlQuery<FormlyModel>(sql, arg);
            // var list = _respository.GetListByStore<FormlyModel>("[dbo].[Proc_SelectPaged_Formly]", arg);
            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<FormlyModel>(list, rows, request.PageSize, request.PageIndex);
        }
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public FormlyModel GetFormlyById(int id)
        {
            return _respository.GetObjectByStore<FormlyModel>("[dbo].Prc_FormlyGetById", new { Id = id });
        }

        public FormlyModel GetFormlyByCode(string code)
        {
            return _respository.GetObjectByStore<FormlyModel>("[dbo].Prc_FormlyGetByCode", new { Code = code });
        }

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(FormlyModel entry)
        {
            var arg = new
            {
                entry.FormCode,
                entry.FormName,
                entry.FormJson,
                entry.Description,
                entry.IsLocked,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_FormlyInsert]", arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(FormlyModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.FormCode,
                entry.FormName,
                entry.FormJson,
                entry.Description,
                entry.IsLocked,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_FormlyUpdate]", arg);
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
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_FormlyDelete]", arg);
            return response;
        }



        public IEnumerable<FormlyModel> GetByDistrict(int districtId)
        {
            var Formlys = _respository.GetListByStore<FormlyModel>("dbo.[Prc_FormlyGetByDistrict]", new { DistrictId = districtId });

            return Formlys;
        }

        public IEnumerable<DistrictModel> GetDistrictByProvice(int proviceId)
        {
            var lst = _respository.GetListByStore<DistrictModel>("dbo.[Prc_District_GetByProvice]", new { Id = proviceId });

            return lst;
        }
    }
}

