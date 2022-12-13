using System;
using System.Collections.Generic;
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
    public class FieldsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IFieldsService _fieldsService;
        private AppConfiguration appConfiguration;
        public FieldsController(IConfiguration configuration,
            IFieldsService baseService)
        {
            _fieldsService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }
        private static List<object> BuildFieldsChildrenTree(List<FieldsModel> fieldss, int id, int KeyNodeSelected)
        {
            return (from fields in fieldss.Where(x => x.ParentId == id)
                    let existing = fieldss.Count(x => x.ParentId == fields.Id) > 0
                    select new
                    {
                        key = fields.Id.ToString(),
                        title = fields.Name,
                        folder = existing,
                        active = (fields.Id == KeyNodeSelected),
                        ParentId = fields.ParentId,
                        extraClasses = "css_dep",
                        children = existing ? BuildFieldsChildrenTree(fieldss, fields.Id, KeyNodeSelected) : new List<object>()
                    }).Cast<object>().ToList();
        }
        [HttpPost]
        public IActionResult GetFieldsTree([FromBody] GetByPageRequest request)
        {
            try
            {
                var fieldss = _fieldsService.GetAllFields().ToList();
                List<FieldsModel> newList = fieldss.GetRange(0, fieldss.Count);

                var newFieldss = DropdownHelper.BuildTreeFields(newList, 0);
                var newFieldsTree = (from fields in fieldss.Where(x => x.ParentId == 0)
                                      let existing = fieldss.Count(x => x.ParentId == fields.Id) > 0
                                      select new
                                      {
                                          key = fields.Id.ToString(),
                                          title = fields.Name,
                                          folder = existing,
                                          active = (fields.Id == request.KeyNodeSelected),
                                          ParentId = fields.ParentId,
                                          extraClasses = "css_dep",
                                          children = existing ? BuildFieldsChildrenTree(fieldss, fields.Id, request.KeyNodeSelected) : new List<object>()
                                      }).Cast<object>().ToList();

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Fieldss = newFieldss,
                        FieldsTree = newFieldsTree
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "FieldsGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var fieldss = _fieldsService.GetAllFields().ToList();
                var newFieldss = DropdownHelper.BuildTreeFields(fieldss, 0);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Fieldss = newFieldss
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "FieldsGetAll");
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
                var fieldss = _fieldsService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = fieldss
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "FieldsGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult SaveFields([FromBody] FieldsModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {

                    response = _fieldsService.Create(model);
                }
                else
                {
                    response = _fieldsService.Update(model);
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
                var fields = _fieldsService.GetFieldsById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = fields
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
        public IActionResult DeleteFields([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _fieldsService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CatalogPosition");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }



    }
}
