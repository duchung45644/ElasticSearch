using System;
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
    public class DistrictController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IDistrictService _districtService;
        private AppConfiguration appConfiguration;
        public DistrictController(IConfiguration configuration,
            IDistrictService baseService)
        {
            _districtService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var districts = _districtService.GetAllDistrict().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Districts = districts
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DistrictGetAll");
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
                var districts = _districtService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = districts
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DistrictGetAll");
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
                var district = _districtService.GetDistrictById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = district
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
        public IActionResult SaveDistrict([FromBody] DistrictModel model)
        {
            try
            {
                Response response;
                
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _districtService.Create(model);
                    Logger.LogMonitor(new MonitorModel()
                    {
                        Type = 3,
                        UserId = Convert.ToInt32(userId),
                        Description = "Thêm mới danh mục Quận/Huyện",
                        Object = "District"
                    });
                }
                else
                {
                    response = _districtService.Update(model);
                    Logger.LogMonitor(new MonitorModel()
                    {
                        Type = 3,
                        UserId = Convert.ToInt32(userId),
                        Description = "Cập nhật danh mục Quận/Huyện",
                        Object = "District"
                    });
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
        public IActionResult DeleteDistrict([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _districtService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteDistrict");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult GetAllProvince([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var district = _districtService.GetAllProvince(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = district
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
    }
}


