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
    public class CommuneController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommuneService _communeService;
        private AppConfiguration appConfiguration;
        public CommuneController(IConfiguration configuration,
            ICommuneService baseService)
        {
            _communeService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var communes = _communeService.GetAllCommune().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Communes = communes
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CommuneGetAll");
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
                var communes = _communeService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = communes
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CommuneGetAll");
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
                var commune = _communeService.GetCommuneById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = commune
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
        public IActionResult SaveCommune([FromBody] CommuneModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _communeService.Create(model);
                }
                else
                {
                    response = _communeService.Update(model);
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
        public IActionResult DeleteCommune([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _communeService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteCommune");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }


        [HttpPost]
        public IActionResult GetDistrictByProvince([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var commune = _communeService.GetDistrictByProvice(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = commune
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
