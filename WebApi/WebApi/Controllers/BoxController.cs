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
    public class BoxController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IBoxService _boxService;
        private readonly IShelfService _shelfService;
        private readonly IRecordService _recordService;
        private AppConfiguration appConfiguration;
        public BoxController(IConfiguration configuration,
            IShelfService shelfService,
            IRecordService recordService,
            IBoxService baseService)
        {
            _boxService = baseService;
            _shelfService = shelfService;
            _configuration = configuration;
            _recordService = recordService;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var boxs = _boxService.GetAllBox().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Boxs = boxs
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ShelfGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

       
        [HttpPost]
        public IActionResult SaveBox([FromBody] BoxModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _boxService.Create(model);
                }
                else
                {
                    response = _boxService.Update(model);
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
                var box = _boxService.GetBoxById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = box
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
        public IActionResult GetByPageRecord([FromBody] GetByPageRequest request)
        {
            try
            {
                var boxs = _boxService.GetBoxById(request.BoxId);
                var records = _recordService.GetById(request.RecordId);
                var ListRecord = _boxService.GetByPageRecord(request);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = boxs,
                    ListRecord = ListRecord,
                    Record= records
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByPage");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult DeleteBox([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _boxService.Delete(request.Id);
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

        [HttpPost]
        public IActionResult GetAllCategory([FromBody] GetByPageRequest request)
        {
            try
            {
                var box = _boxService.GetAllCategory().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Box = box
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
        public IActionResult GetByShelf([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var box = _boxService.GetByShelft(request.Id);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = box
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
