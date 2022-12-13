using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    [Authorize(Policy = Policies.Admin)]
    public class DynamicFormController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _CommonService;
        IFormlyService _formlyService;
        private AppConfiguration appConfiguration;
        public DynamicFormController(IConfiguration configuration,
            ICommonService baseService, IFormlyService formlyService)
        {
            _CommonService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
            _formlyService = formlyService;
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var objs = _formlyService.GetAllFormly().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        ListObj = objs
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetAllFormly");
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
                var DynamicForm = _formlyService.GetFormlyById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = DynamicForm
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
        public IActionResult GetByCode([FromBody] GetByIdRequest<string> request)
        {
            try
            {
                var DynamicForm = _formlyService.GetFormlyByCode(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = DynamicForm
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
        public IActionResult SaveDynamicForm([FromBody] FormlyModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _formlyService.Create(model);
                }
                else
                {
                    response = _formlyService.Update(model);
                }
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
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
