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
    

    public class RoleController :  BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IRoleService _roleService;
        private readonly IRightService _rightService;

        private AppConfiguration appConfiguration;

        public RoleController(IConfigurationService configurationService,
                                    IRoleService roleService,
                                    IStaffService staffService,
                                    ICacheProviderService cacheProvider,
                                    IConfiguration configuration,
                                    IPositionService positionService,
                                    IRightService rightService)
            : base(configurationService, cacheProvider, configuration, staffService)
        {
            _roleService = roleService;
            _rightService = rightService;
        }
        //build tree
        private static List<object> BuildChildrenRightTree(List<RightModel> rights, int rightId)
        {
            return (from right in rights.Where(x => x.ParentId == rightId && x.Name != null)
                    let existing = rights.Count(x => x.ParentId == right.Id) > 0
                    select new
                    {
                        key = right.Id,
                        title = right.Name,
                        folder = existing,
                        selected = right.Selected,
                        preselected = right.PreSelected,
                        children = existing ? BuildChildrenRightTree(rights, right.Id) : new List<object>()
                    }).Cast<object>().ToList();
        }

        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var roles = _roleService.GetAllRole(request.UnitId).ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Roles = roles
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RoleGetAll");
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
                RoleModel role = new RoleModel() { UnitId = request.UnitId};
                if (request.Id != 0)
                {
                    role = _roleService.GetRoleById(request.Id);
                }
                //
                var rights = _rightService.GetAllRight().ToList();
                //
                var actions = _roleService.GetActionByRoleId(request.Id, request.UnitId).ToList();
                rights = (from r in rights
                          join a in actions on r.Id equals a.RightId
                          select r).Distinct().ToList();
                rights.AddRange(actions.Select(x => new RightModel
                {
                    Id = x.Id * (-1),
                    Name = x.Name,
                    ParentId = x.RightId,
                    Selected = x.Selected,
                    PreSelected = x.Selected
                }));
                //
                var root = (from right in rights.Where(x => x.ParentId == 0 && x.Name != null)
                            let existing = rights.Count(x => x.ParentId == right.Id) > 0
                            select new
                            {
                                key = right.Id,
                                title = right.Name,
                                folder = existing,
                                selected = right.Selected,
                                preselected = right.PreSelected,
                                children = existing ? BuildChildrenRightTree(rights, right.Id) : new List<object>()
                            }).Cast<object>().ToList();

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Role= role,
                    Rights = root
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "LoadActionOfUnit");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }



        //[HttpPost]
        //public IActionResult GetById([FromBody] GetByIdRequest<int> request)
        //{
        //    try
        //    {
        //        var role = _roleService.GetRoleById(request.Id); 
                
        //        return Ok(new
        //        {
        //            Message = "Thành công.",
        //            Success = true,
        //            Data = role
        //        });

        //    }
        //    catch (Exception ex)
        //    {

        //        Logger.LogError(ex, "GetById");
        //        return Ok(new
        //        {
        //            Message = ex.Message,
        //            Success = false
        //        });
        //    }
        //}
        [HttpPost]
        public IActionResult SaveRole([FromBody] RoleModel model)
        {
            try
            {
                model.CreatedUserId = GetStaffIdLogin();
                Response response;
                if (model.Id == 0)
                {

                    response = _roleService.Create(model);
                }
                else
                {
                    response = _roleService.Update(model);
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
        public IActionResult DeleteRole([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _roleService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteRole");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
    }
}
