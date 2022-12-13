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
    public class ShelfController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IShelfService _shelfService;
        
        private AppConfiguration appConfiguration;
        public ShelfController(IConfiguration configuration,
            IShelfService baseService)
        {
            _shelfService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }
      
        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var shelfs = _shelfService.GetAllShelf().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Shelfs = shelfs
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
        public IActionResult GetByPage([FromBody] GetByPageRequest request)
        {
            try
            {
                var boxs = _shelfService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = boxs
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "BoxGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult SaveShelf([FromBody] ShelfModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _shelfService.Create(model);
                }
                else
                {
                    response = _shelfService.Update(model);
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
                var shelf = _shelfService.GetShelfById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = shelf
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
        public IActionResult DeleteShelf([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _shelfService.Delete(request.Id);
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
                var shelf = _shelfService.GetAllCategory().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Shelf = shelf
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
        public IActionResult GetAllWarehouse([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var shelf = _shelfService.GetAllWarehouse(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = shelf
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
