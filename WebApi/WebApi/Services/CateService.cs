using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface ICateService
    {
        IEnumerable<CateModel> GetAllCate();
        IEnumerable<DepartmentModel> getAllDepartment();
        PagedData<CateModel> GetByPage(GetByPageRequest request);

        Response Create(CateModel entry);
        Response CreateNew(CateModel entry);

        CateModel GetCateById(int id);
        Response Update(CateModel entry);
        Response Delete(int id);
    }
    public class CateService : ICateService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public CateService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<CateModel> GetAllCate()
        {
            var cates = _respository.GetListByStore<CateModel>("dbo.[Prc_CateGetAll]", new { });

            return cates;
        }

        public IEnumerable<DepartmentModel> getAllDepartment()
        {
            var departments = _respository.GetListByStore<DepartmentModel>("dbo.[Prc_departmentgetAll]", new { });

            return departments;
        }

        public PagedData<CateModel> GetByPage(GetByPageRequest request)
        {

            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                request.KeyWord = request.KeyWord.Trim();
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




            if (!string.IsNullOrWhiteSpace(request.KeyWord))
            {
                sqlwhere += " AND  ( c.txtCatename LIKE '%' + @Keyword + '%'  ) ";
            }
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = " desc ";
            }
            var SortField = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortField = " c.intCateID ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "txtCatename":
                        {
                            SortField = " c.txtCatename ";
                            break;
                        }
                  

                    default:
                        SortField = " c.intCateID ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
        @PageLowerBound INT;
SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
SELECT @count = COUNT(1)
FROM [dbo].[fam_cate] c
WHERE 1 = 1 " + sqlwhere +
    @" 
  
SELECT @count AS TotalRowCount,
       c.*
FROM [dbo].[fam_cate] c
   
WHERE 1 = 1 " + sqlwhere +
    @" 
    
    ORDER BY " + SortField + request.SortDirection + @"
			 OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
 ";
            var rows = 0;

            var list = _respository.GetListBySqlQuery<CateModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<CateModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public CateModel GetCateById(int id)
        {
            return _respository.GetObjectByStore<CateModel>("[dbo].Prc_CateGetById", new { intCateID = id });
        }


        public Response Create(CateModel entry)
        {
            var arg = new
            {
                entry.txtCatename,
                entry.txtCatetDesc,
                entry.visible,
                entry.intCanDelete,
                entry.intdel,
                entry.intlevel,
                entry.intDisplayOrder,
                entry.txttelephone,
                entry.txtfax,
                entry.intProfile,
                entry.ParentID,
                entry.CateCode,
                entry.UnitId,
                entry.IsUnit,
                entry.SortOrder,


            };
          
            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_CateInsert", arg);
            return response;
        }

        public Response CreateNew(CateModel entry)
        {
            var arg = new
            {
                entry.txtCatename,
                entry.txtCatetDesc,
                entry.visible,
                entry.intCanDelete,
                entry.intdel,
                entry.intlevel,
                entry.intDisplayOrder,
                entry.txttelephone,
                entry.txtfax,
                entry.intProfile,
                entry.ParentID,
                entry.CateCode,
               entry.IsUnit,
               entry.SortOrder,



            };

            var response = _respository.GetObjectByStore<Response>("[dbo].Prc_CateInsertNew", arg);
            return response;
        }
        public Response Update(CateModel entry)
        {
            var arg = new
            {
                entry.intCateID,
                entry.txtCatename,
                entry.intCanDelete,
                entry.txtCatetDesc,
                entry.visible,
                entry.intdel,
                entry.intlevel,
                entry.intDisplayOrder,
                entry.txttelephone,
                entry.txtfax,
                entry.intProfile,
                entry.ParentID,
                entry.CateCode,
                entry.UnitId,
                entry.IsUnit,
                entry.SortOrder,

            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CateUpdate]", arg);
            return response;
        }


        public Response Delete(int id)
        {
            var arg = new
            {
                intCateID = id
            };
            var response = _respository.GetObjectByStore<Response>("dbo.[Prc_CateDelete]", arg);
            return response;
        }



    }
}

