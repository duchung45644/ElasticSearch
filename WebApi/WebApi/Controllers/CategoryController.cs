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

    public class CategoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly ICategoryService _categoryService;
        private AppConfiguration appConfiguration;
        public CategoryController(IConfiguration configuration,
            ICommonService baseService, ICategoryService categoryService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _categoryService = categoryService;
            appConfiguration = new AppConfiguration(configuration);
        }
        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var categorys = _categoryService.GetAllCategory().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Categorys = categorys
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CateforyGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllProvice()
        {
            try
            {

                var categorys = _categoryService.GetAllProvice();

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = categorys
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetAllProvice");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }



        [HttpPost]
        public IActionResult GetDistrictByProvice([FromBody] GetByIdRequest<int> request)
        {
            try
            {

                var categorys = _categoryService.GetDistrictByProvice(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = categorys
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetDistrictByProvice");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetCommuneByDistrict([FromBody] GetByIdRequest<int> request)
        {
            try
            {

                var categorys = _categoryService.GetCommuneByDistrict(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = categorys
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetCommuneByDistrict");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }

        [HttpPost]
        public IActionResult GetCategoryByCode([FromBody] GetByIdRequest<string> request)
        {
            try
            {

                var categorys = _categoryService.GetCategoryByCode(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = categorys
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetCategoryByCode");
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
                var cates = _categoryService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cates
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CateGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult Save([FromBody] CategoryModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.CategoryId == 0)
                {
                        response = _categoryService.Create(model);
                    Logger.LogMonitor(new MonitorModel()
                    {
                        Type = 3,
                        UserId = Convert.ToInt32(userId),
                        Description = "Thêm danh mục:" + model.Code,
                        Object = "dm"
                    });


                }

                else
                {
                    response = _categoryService.Update(model);
                    Logger.LogMonitor(new MonitorModel()
                    {
                        Type = 3,
                        UserId = Convert.ToInt32(userId),
                        Description = "Sửa danh mục:"+ model.Code,
                        Object = "dm"
                    });
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
                var cate = _categoryService.GetCategoryById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cate
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
                Response response = _categoryService.Delete(request.Id);
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                Logger.LogMonitor(new MonitorModel()
                {
                    Type = 3,
                    UserId = Convert.ToInt32(userId),
                    Description = "Xóa danh mục",
                    Object = "dm"
                });
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteCate");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }


    }
}
