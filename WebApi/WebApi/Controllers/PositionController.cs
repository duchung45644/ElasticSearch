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
    public class PositionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IPositionService _positionService;
        private AppConfiguration appConfiguration;
        public PositionController(IConfiguration configuration,
            IPositionService baseService)
        {
            _positionService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var positions = _positionService.GetAllPosition().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Positions = positions
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
                var positions = _positionService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = positions
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
        public IActionResult SavePosition([FromBody] PositionModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _positionService.Create(model);
                }
                else
                {
                    response = _positionService.Update(model);
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
                var position = _positionService.GetPositionById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = position
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
        public IActionResult DeletePosition([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _positionService.Delete(request.Id);
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
