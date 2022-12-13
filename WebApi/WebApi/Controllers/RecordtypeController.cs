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
    public class RecordtypeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IRecordtypeService _recordtypeService;
        private AppConfiguration appConfiguration;
        public RecordtypeController(IConfiguration configuration,
            IRecordtypeService baseService)
        {
            _recordtypeService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var recordtypes = _recordtypeService.GetAllRecordtype().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Recordtypes = recordtypes
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
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
                var recordtypes = _recordtypeService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = recordtypes
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult Save([FromBody] RecordtypeModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _recordtypeService.Create(model);
                }
                else
                {
                    response = _recordtypeService.Update(model);
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
                var recordtype = _recordtypeService.GetRecordTypeById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = recordtype
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
        public IActionResult Delete([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _recordtypeService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeletePosition");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }



    }
}
