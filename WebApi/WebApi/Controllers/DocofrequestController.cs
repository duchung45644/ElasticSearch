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

    public class DocofrequestController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IDocofrequestService _DocofrequestService;
        private AppConfiguration appConfiguration;

        public DocofrequestController(IConfiguration configuration,
            ICommonService baseService, IDocofrequestService DocofrequestService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _DocofrequestService = DocofrequestService;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var docofrequest = _DocofrequestService.GetAll().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = docofrequest
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DepartmentGetAll");
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

                var docofrequests = _DocofrequestService.GetByID(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = docofrequests
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
        public IActionResult Delete([FromBody] DocofrequestModel model)
        {
            try
            {
                var file = _DocofrequestService.Delete(model);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CancelDocofrequest");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult DocofrequestDelete([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _DocofrequestService.DocofrequestDelete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DocofrequestDelete");
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
                var cates = _DocofrequestService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cates
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DocofrequestGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        public IActionResult SaveRerecord([FromBody] DocofrequestModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                //model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {
                    response = _DocofrequestService.CreateDocofrequest(model);
                }
                else
                {
                    response = _DocofrequestService.UpdateDocofrequest(model);
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
