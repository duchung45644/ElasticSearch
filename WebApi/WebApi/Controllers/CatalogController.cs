using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    [Authorize(Policy = Policies.Admin)]
    public class CatalogController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICatalogService _catalogService;
        private AppConfiguration appConfiguration;
        public CatalogController(IConfiguration configuration,
            ICatalogService baseService)
        {
            _catalogService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }
        private static List<object> BuildCatalogChildrenTree(List<CatalogModel> catalogs, int id, int KeyNodeSelected)
        {
            return (from catalog in catalogs.Where(x => x.ParentId == id)
                    let existing = catalogs.Count(x => x.ParentId == catalog.Id) > 0
                    select new
                    {
                        key = catalog.Id.ToString(),
                        title = catalog.Name,
                        folder = existing,
                        active = (catalog.Id == KeyNodeSelected),
                        ParentId = catalog.ParentId,
                        extraClasses = "css_dep",
                        children = existing ? BuildCatalogChildrenTree(catalogs, catalog.Id, KeyNodeSelected) : new List<object>()
                    }).Cast<object>().ToList();
        }
        [HttpPost]
        public IActionResult GetCatalogTree([FromBody] GetByPageRequest request)
        {
            try
            {
                var catalogs = _catalogService.GetAllCatalog().ToList();
                List<CatalogModel> newList = catalogs.GetRange(0, catalogs.Count);

                var newCatalogs = DropdownHelper.BuildTreeCatalog(newList, 0);
                var newCatalogTree = (from catalog in catalogs.Where(x => x.ParentId == 0)
                                    let existing = catalogs.Count(x => x.ParentId == catalog.Id) > 0
                                    select new
                                    {
                                        key = catalog.Id.ToString(),
                                        title = catalog.Name,
                                        folder = existing,
                                        active = (catalog.Id == request.KeyNodeSelected),
                                        ParentId = catalog.ParentId,
                                        extraClasses = "css_dep",
                                        children = existing ? BuildCatalogChildrenTree(catalogs, catalog.Id, request.KeyNodeSelected) : new List<object>()
                                    }).Cast<object>().ToList();

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Catalogs = newCatalogs,
                        CatalogTree = newCatalogTree
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CatalogGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var catalogs = _catalogService.GetAllCatalog().ToList();
                var newCatalogs = DropdownHelper.BuildTreeCatalog(catalogs, 0);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Catalogs = newCatalogs
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CatalogGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetByPage([FromBody] GetByPageRequest request)
        {
            try
            {
                var catalogs = _catalogService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = catalogs
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CatalogGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult SaveCatalog([FromBody] CatalogModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _catalogService.Create(model);
                }
                else
                {
                    response = _catalogService.Update(model);
                }

                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,
                    response.ReturnId
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "InitReport");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult GetById([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var catalog = _catalogService.GetCatalogById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = catalog
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetById");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult RowSelectionChangeLog([FromBody] CatalogModel model)
        {
            try
            {
                var file = _catalogService.RowSelectionChangeLog(model);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CancelRegistrasionlist");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult DeleteCatalog([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _catalogService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CatalogPosition");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }



    }
}
