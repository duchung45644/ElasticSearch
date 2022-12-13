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
    public class ConditionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IConditionService _conditionService;
        private AppConfiguration appConfiguration;
        public ConditionController(IConfiguration configuration,
            IConditionService baseService)
        {
            _conditionService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var conditions = _conditionService.GetAllCondition().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Conditions = conditions
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ConditionGetAll");
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
                var conditions = _conditionService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = conditions
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ConditionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult SaveCondition([FromBody] ConditionModel model)
        {
            try
            {
                Response response;
               
                if (model.Id == 0)
                {

                    response = _conditionService.Create(model);
                }
                else
                {
                    response = _conditionService.Update(model);
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
                var condition = _conditionService.GetConditionById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = condition
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
        public IActionResult DeleteCondition([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _conditionService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteCondition");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }



    }
}
