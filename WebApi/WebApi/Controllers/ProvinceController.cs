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
    public class ProvinceController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IProvinceService _provinceService;
        private AppConfiguration appConfiguration;
        public ProvinceController(IConfiguration configuration,
            IProvinceService baseService)
        {
            _provinceService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var provinces = _provinceService.GetAllProvince().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Provinces = provinces
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ProvinceGetAll");
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
                var province = _provinceService.GetProvinceById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = province
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
        public IActionResult GetByPage([FromBody] GetByPageRequest request)
        {
            try
            {
                var provinces = _provinceService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = provinces
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ProvinceGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult SaveProvince([FromBody] ProvinceModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _provinceService.Create(model);
                }
                else
                {
                    response = _provinceService.Update(model);
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
        public IActionResult DeleteProvince([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _provinceService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteProvince");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
    }
}
