using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class WarehouseController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IWarehouseService _warehouseService;
        private readonly ICategoryService _categoryService;
        private readonly IShelfService _shelfService;
        private readonly IBoxService _boxService;
        private AppConfiguration appConfiguration;
        public WarehouseController(IConfigurationService configurationService,
                                    IStaffService staffService,
                                    ICacheProviderService cacheProvider,
                                    IConfiguration configuration,
                                    IWarehouseService warehouseService,
                                    ICategoryService categoryService,
                                   IShelfService shelfService,
                                   IBoxService boxService,
                                    IRightService rightService)
            : base(configurationService, cacheProvider, configuration, staffService) { 
            _warehouseService = warehouseService;
            _configuration = configuration;
            _categoryService = categoryService;
            _shelfService = shelfService;
            _boxService = boxService;
            appConfiguration = new AppConfiguration(configuration);
        }

        #region private function
        private static List<object> BuildWarehouseChildrenTree(List<WarehouseModel> warehouses, int id, int KeyNodeSelected)
        {
            return (from warehouse in warehouses.Where(x => x.ParentId == id)
                    let existing = warehouses.Count(x => x.ParentId == warehouse.Id) > 0
                    select new
                    {
                        key = warehouse.Id.ToString(),
                        icon = warehouse.Id < 0 ? "fa fa-user-o icon-color" : warehouse.IsUnit ? "fa fa-university  icon-university-o icon-color" : "fa fa-building-o  icon-building icon-color",
                        title = warehouse.Name,
                        folder = existing,
                        //  selected = (department.Id == KeyNodeSelected),
                        active = (warehouse.UnitId == KeyNodeSelected),

                        ParentId = warehouse.ParentId,
                        extraClasses = warehouse.Id < 0 ? "css_staff" : warehouse.IsUnit ? "css_unit" : "css_dep",
                        children = existing ? BuildWarehouseChildrenTree(warehouses, warehouse.Id, KeyNodeSelected) : new List<object>()
                    }).Cast<object>().ToList();
        }
       
        #endregion
        [HttpPost]
        public IActionResult WarehouseTree([FromBody] GetByPageRequest request)
        {
            try
            {
                if (!request.IsLoginUnitOnly)
                {
                    request.UnitId = Constants.UnitIdRoot;
                }
                else
                {
                    var staff = this.GetStaffLogin();
                    request.UnitId = staff.UnitId;
                }
                var warehouses = _warehouseService.GetAllWarehouseByUnitId(request.UnitId).ToList();
                var warehouseDropdown = DropdownHelper.BuildWarehouseDropdown(warehouses, request.UnitId);

                var shefs = this._shelfService.GetAllShelfByUnitId(request).ToList();
                warehouses.AddRange(shefs.Select(x => new WarehouseModel
                {
                    Id = x.Id * (-1),
                    Name = x.ShelfName,
                    ParentId = x.WarehouseId
                }));
                var newwarehouses = (from warehouse in warehouses.Where(x => x.ParentId == 0 || x.UnitId == request.UnitId)
                                      let existing = warehouses.Count(x => x.ParentId == warehouse.Id) > 0
                                      select new
                                      {
                                          key = warehouse.Id.ToString(),
                                          icon = warehouse.IsUnit ? "fa fa-university  icon-university icon-color" : "fa fa-building  icon-building icon-color",
                                          title = warehouse.Name,
                                          folder = existing,
                                          //  selected = (department.Id == request.KeyNodeSelected),
                                          active = (warehouse.UnitId == request.KeyNodeSelected),
                                          ParentId = warehouse.ParentId,
                                          extraClasses = warehouse.Id < 0 ? "css_staff" : warehouse.IsUnit ? "css_unit" : "css_dep",
                                          children = existing ? BuildWarehouseChildrenTree(warehouses, warehouse.Id, request.KeyNodeSelected) : new List<object>()
                                      }).Cast<object>().ToList();

                //var category = _categoryService.GetAllCategory().ToList();


                //Get staff gender

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Warehouses = newwarehouses,
                        Parents = warehouseDropdown,
                      
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetTreeUnitAndStaff");
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
                var warehouses = _warehouseService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = warehouses
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "WarehouseGetAll");
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
                var warehouses = _warehouseService.GetAllWarehouse().ToList();
                //var newWarehouses = DropdownHelper.BuildWarehouseDropdown(warehouses, 0);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Warehouses = warehouses
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "WarehouseGetAll");
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
                var warehouse = _warehouseService.GetWarehouseById(request.Id);
              
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = warehouse
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
        public IActionResult SaveWarehouse([FromBody] WarehouseModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);

                var staff = this.GetStaffLogin();
                model.UnitId = staff.UnitId;
                if (model.Id == 0)
                {

                    response = _warehouseService.Create(model);
                }
                else
                {
                    response = _warehouseService.Update(model);
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
        public IActionResult DeleteWarehouse([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _warehouseService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteWarehouse");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult GetAllCategory([FromBody] GetByPageRequest request)
        {
            try
            {
                var warehouse = _warehouseService.GetAllCategory().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Warehouse = warehouse
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "WarehouseGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }


    }
}
