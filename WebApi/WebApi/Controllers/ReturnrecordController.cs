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

    public class ReturnrecordController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IReturnrecordService _ReturnrecordService;
        private AppConfiguration appConfiguration;

        public ReturnrecordController(IConfiguration configuration,
            ICommonService baseService, IReturnrecordService ReturnrecordService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _ReturnrecordService = ReturnrecordService;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAllReturnrecord()
        {
            try
            {

                var Returnrecords = _ReturnrecordService.GetAllReturnrecord();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = Returnrecords
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllReturnrecord");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }


        [HttpPost]
        public IActionResult GetByID([FromBody] GetByIdRequest<int> request)
        {
            try
            {

                var Returnrecords = _ReturnrecordService.GetByID(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Returnrecords
                });
            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByID");
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
                var cates = _ReturnrecordService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cates
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "FondGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }


        [HttpPost]
        public IActionResult SaveReturnrecord([FromBody] ReturnrecordModel model)
        {
            try
            {
                Response response;
                //string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                //model.CreatedUserId = Convert.ToInt32(userId);
                if (model.RegistrasionlistId == 0)
                {
                    response = _ReturnrecordService.CreateReturncord(model);
                }
                else
                {
                    response = _ReturnrecordService.UpdateReturncord(model);
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
        public IActionResult SaveRequest([FromBody] ReturnrecordModel model)
        {
            try
            {
                Response response;
                //string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                //model.CreatedUserId = Convert.ToInt32(userId);
                if (model.RegistrasionlistId == 0)
                {
                    response = _ReturnrecordService.CreateRequest(model);
                }
                else
                {
                    response = _ReturnrecordService.UpdateRequest(model);
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

    }
}
