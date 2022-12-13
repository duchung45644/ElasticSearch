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
    public class RightController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IRightService _rightService;
        private AppConfiguration appConfiguration;
        public RightController(IConfiguration configuration,
            IRightService baseService)
        {
            _rightService = baseService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }

        #region private function
        private static List<object> BuildRightChildrenTree(List<RightModel> rights, int id, int KeyNodeSelected)
        {
            return (from right in rights.Where(x => x.ParentId == id)
                    let existing = rights.Count(x => x.ParentId == right.Id) > 0
                    select new
                    {
                        key = right.Id.ToString(),
                        title = right.Name,
                        folder = existing,
                        active = (right.Id == KeyNodeSelected),
                        ParentId = right.ParentId,
                        extraClasses = "css_dep",
                        children = existing ? BuildRightChildrenTree(rights, right.Id, KeyNodeSelected) : new List<object>()
                    }).Cast<object>().ToList();
        }
        #endregion

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var rights = _rightService.GetAllRight().ToList();
                var newRights = DropdownHelper.BuildTreeRight(rights, 0);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Rights = newRights
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RightGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }


        [HttpPost]
        public IActionResult GetRightTree([FromBody] GetByPageRequest request)
        {
            try
            {
                var rights = _rightService.GetAllRight().ToList();
                List<RightModel> newList = rights.GetRange(0, rights.Count);

                var newRights = DropdownHelper.BuildTreeRight(newList, 0);
                var newRightTree = (from right in rights.Where(x => x.ParentId == 0)
                                    let existing = rights.Count(x => x.ParentId == right.Id) > 0
                                    select new
                                    {
                                        key = right.Id.ToString(),
                                        title = right.Name,
                                        folder = existing,
                                        active = (right.Id == request.KeyNodeSelected),
                                        ParentId = right.ParentId,
                                        extraClasses = "css_dep",
                                        children = existing ? BuildRightChildrenTree(rights, right.Id, request.KeyNodeSelected) : new List<object>()
                                    }).Cast<object>().ToList();

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Rights = newRights,
                        RightTree = newRightTree
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RightGetAll");
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
                var right = _rightService.GetRightById(request.Id);
                right.ListAction = _rightService.GetActionByRightId(request.Id).ToList(); 
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = right
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
        public IActionResult SaveRight([FromBody] RightModel model)
        {
            try
            {
                Response response;
                if (model.Id == 0)
                {

                    response = _rightService.Create(model);
                }
                else
                {
                    response = _rightService.Update(model);
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
        public IActionResult DeleteRight([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _rightService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteRight");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
    }
}
