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

    public class FondController: ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IFondService _FondService;
        private AppConfiguration appConfiguration;

        public FondController(IConfiguration configuration,
            ICommonService baseService, IFondService FondService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _FondService = FondService;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetAllFond()
        {
            try
            {

                var fonds = _FondService.GetAllFond();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success =true,
                    Data = fonds
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllFond");
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

                var fonds = _FondService.GetByID(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = fonds
                });
            }
            catch(Exception ex)
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
                var cates = _FondService.GetByPage(request);
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
        public IActionResult Save([FromBody] FondModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {
                    response = _FondService.Create(model);
                }
                else
                {
                    response = _FondService.Update(model);
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
        public IActionResult Delete([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _FondService.Delete(request.Id);
               
                
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteFond");
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
                var fond = _FondService.GetAllCategory().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Fond = fond
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
    }
}
