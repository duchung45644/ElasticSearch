using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{
    public interface IFondService
    {
        IEnumerable<FondModel> GetAllFond();
        PagedData<FondModel> GetByPage(GetByPageRequest request);

        Response Create(FondModel entry);
        FondModel GetByID(int id);
        Response Update(FondModel entry);
        Response Delete(int id);
        IEnumerable<FondModel> GetAllCategory();
    }
    public class FondService : IFondService
    {
        private readonly ICommonRepository _respository;

        public FondService(ICommonRepository respository)
        {
            _respository = respository;//cái này
        }

        public IEnumerable<FondModel> GetAllFond()
        {
            var fond = _respository.GetListByStore<FondModel>("[esto].[Prc_FondGetAll]", new { });

            return fond;
        }

        public PagedData<FondModel> GetByPage(GetByPageRequest request)
        {
            if(!string.IsNullOrWhiteSpace(request.KeyWord))
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
                sqlwhere += " AND (c.FondName Like '%' + @Keyword + '%' OR c.UnitId LIKE '%' + @Keyword + '%' )";
            }
            if (string.IsNullOrWhiteSpace(request.SortDirection))
            {
                request.SortDirection = "desc ";
            }
            var SortFile = "";
            if (string.IsNullOrWhiteSpace(request.SortField))
            {
                SortFile = " c.Id ";
            }
            else
            {
                switch (request.SortField)
                {
                    case "name":
                        {
                            SortFile = " c.FondName ";
                            break;
                        }
                    case "Code":
                        {
                            SortFile = " c.FondCode ";
                            break;
                        }

                    default:
                        SortFile = " c.Id ";
                        break;
                }
            }
            var sql = @" DECLARE @count INT,
        @PageLowerBound INT;
SELECT @PageLowerBound = @PageSize * (@PageIndex - 1);
SELECT @count = COUNT(1)
FROM [esto].[Fond] c
WHERE 1 = 1 " + sqlwhere +
        @"

SELECT @count AS TotalRowCount,
        c.*,d.Name as DepartmentName
FROM [esto].[Fond] c left join acc.Department d on d.Id = c.DepartmentId

WHERE 1 = 1 " + sqlwhere + 
    @" 

    ORDER BY  " +SortFile + request.SortDirection + @"
            OFFSET @PageLowerBound ROWS FETCH NEXT @PageSize ROWS ONLY;
";

            var rows = 0;

            var list = _respository.GetListBySqlQuery<FondModel>(sql, arg);

            if (list.Any()) rows = list.First().TotalRowCount;
            return new PagedData<FondModel>(list, rows, request.PageSize, request.PageIndex);
        }

        public FondModel GetByID(int id)
        {
            return _respository.GetObjectByStore<FondModel>("[esto].Prc_FondGetById", new { Id = id });
        }

        public Response Create(FondModel entry)
        {
            var arg = new
            {

                
                entry.UnitId,
                entry.ParentId,
                entry.FondCode,
                entry.FondName,
                entry.ArchivesTime,
                entry.PaperDigital,
                entry.PaperTotal,
                entry.KeysGroup,
                entry.OtherType,
                entry.LanguageId,
                entry.FondHistory,
                entry.LookupTools,
                entry.Description,
                entry.CoppyNumber,
                entry.DepartmentId,
                UserId = entry.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[esto].Prc_FondInsert", arg);
            return response;
        }

        public Response Update(FondModel entry)
        {
            var arg = new
            {  
                entry.Id,
                entry.UnitId,
                entry.ParentId,
                entry.FondCode,
                entry.FondName,  
                entry.ArchivesTime,
                entry.PaperDigital,
                entry.PaperTotal,
                entry.KeysGroup,
                entry.OtherType,
                entry.LanguageId,
                entry.FondHistory,
                entry.LookupTools,
                entry.Description,
                entry.CoppyNumber,
                entry.DepartmentId,
                UserId = entry.CreatedUserId

            };
            var response = _respository.GetObjectByStore<Response>("[esto].Prc_FondUpdate", arg);
            return response;
        }

        public Response Delete(int id)
        {
            var arg = new
            {
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("[esto].[Prc_FondDelete]", arg);
            return response;
        }
        public IEnumerable<FondModel> GetAllCategory()
        {
            var fond = _respository.GetListByStore<FondModel>("[esto].[Prc_Fond_getAllCategory]", new { });

            return fond;
        }

    }
}
