using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IProvinceService
    {
        IEnumerable<ProvinceModel> GetAllProvince();
        PagedData<ProvinceModel> GetByPage(GetByPageRequest request);
        Response Create(ProvinceModel entry);
        ProvinceModel GetProvinceById(int id);
        Response Update(ProvinceModel entry);
        Response Delete(int id);
    }
    public class ProvinceService : IProvinceService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public ProvinceService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<ProvinceModel> GetAllProvince()
        {
            var provinces = _respository.GetListByStore<ProvinceModel>("[dbo].[Prc_ProvinceGetAll]", new { });

            return provinces;
        }
 
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public ProvinceModel GetProvinceById(int id)
        {
            return _respository.GetObjectByStore<ProvinceModel>("[dbo].[Prc_ProvinceGetById]", new { Id =id });
        }

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(ProvinceModel entry)
        {
            var arg = new
            {
                entry.Code,
                entry.Name,
                entry.Desciption,
                entry.IsLocked,
                entry.VnPostCode,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[dbo].[Prc_ProvinceInsert]",  arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>

        public PagedData<ProvinceModel> GetByPage(GetByPageRequest request)
        {


            var arg = new
            {
                KeyWord = request.KeyWord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
                request.SortField,
                request.SortDirection
            };
            var sqlwhere = "";

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
                sqlwhere += " AND  ( p.Name LIKE '%' + @Keyword + '%' OR p.Code LIKE '%' + @Keyword + '%' ) ";
            }
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = " desc ";
            }
            var SortField = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortField = " p.Id ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "Name":
                        {
                            SortField = " p.Name ";
                            break;
                        }
                    case "Code":
                        {
                            SortField = " p.Code ";
                            break;
                        }
                    default:
                        SortField = " p.Id ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT, @PageLowerBound INT;
                        SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
                        SELECT @count = COUNT(1)
                        FROM [dbo].[Province] p
                        WHERE 1 = 1 " + sqlwhere +
                      @" 
                        SELECT @count AS TotalRowCount,
                        p.*
                        FROM [dbo].[Province] p
                        WHERE 1 = 1 " + sqlwhere +
                      @" 
                        ORDER BY " + SortField + request.SortDirection + 
                       @"
			            OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
                      ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<ProvinceModel>(sql, arg);
            // var list = _respository.GetListByStore<ProvinceModel>("[dbo].[Proc_SelectPaged_Province]", arg);
            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<ProvinceModel>(list, rows, request.PageSize, request.PageIndex);
        }
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>

        public Response Update(ProvinceModel entry)
        {
            var arg = new
            {
                entry.Id,
                entry.Code,
                entry.Name,
                entry.Desciption,
                entry.IsLocked,
                entry.VnPostCode,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_ProvinceUpdate]", arg);
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
              Id= id
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_ProvinceDelete]", arg);
            return response;
        }

    }
}

