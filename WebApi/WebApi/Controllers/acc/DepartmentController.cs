using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class DepartmentController : BaseApiController
    {
        private readonly IDepartmentService _departmentService;
        private readonly ICategoryService _categoryService;
        private readonly IPositionService _positionService;
        private readonly IRightService _rightService;

        public DepartmentController(IConfigurationService configurationService,
                                    IStaffService staffService,
                                    ICacheProviderService cacheProvider,
                                    IConfiguration configuration,
                                    IDepartmentService departmentService,
                                    ICategoryService categoryService,
                                    IPositionService positionService,
                                    IRightService rightService)
            : base(configurationService, cacheProvider, configuration, staffService)
        {

            _departmentService = departmentService;
            _categoryService = categoryService;
            _positionService = positionService;
            _rightService = rightService;
        }

        #region private function
        private static List<object> BuildDepartmentChildrenTree(List<DepartmentModel> departments, int id, int KeyNodeSelected)
        {
            return (from department in departments.Where(x => x.ParentId == id)
                    let existing = departments.Count(x => x.ParentId == department.Id) > 0
                    select new
                    {
                        key = department.Id.ToString(),
                        icon = department.Id < 0 ? "fa fa-user-o icon-color" : department.IsUnit ? "fa fa-university  icon-university-o icon-color" : "fa fa-building-o  icon-building icon-color",
                        title = department.Name,
                        folder = existing,
                      //  selected = (department.Id == KeyNodeSelected),
                        active = (department.Id == KeyNodeSelected),

                        ParentId = department.ParentId,
                        extraClasses = department.Id < 0 ? "css_staff" : department.IsUnit ? "css_unit" : "css_dep",
                        children = existing ? BuildDepartmentChildrenTree(departments, department.Id, KeyNodeSelected) : new List<object>()
                    }).Cast<object>().ToList();
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
        #endregion
        [HttpPost]
        public IActionResult Init([FromBody] GetByPageRequest request)
        {
            try
            {
                if (!request.IsLoginUnitOnly)
                {
                    request.UnitId = Constants.UnitIdRoot;
                }
                else
                {
                    var staff = this.GetStaffLogin();
                    request.UnitId = staff.UnitId;
                }
                var departments = _departmentService.GetAllDepartmentByUnitId(request.UnitId).OrderBy(x => x.Level).ThenBy(x => x.SortOrder).ToList();
                var departmentDropdown = DropdownHelper.BuildDepartmentDropdown(departments, request.UnitId);

                var staffs = this._staffService.GetAllByUnitId(request).ToList();
                departments.AddRange(staffs.Select(x => new DepartmentModel
                {
                    Id = x.Id * (-1),
                    Name = x.DisplayStaffName,
                    ParentId = x.DepartmentId
                }));
                var newdepartments = (from department in departments.Where(x => x.ParentId == 0 || x.Id ==request.UnitId)
                                      let existing = departments.Count(x => x.ParentId == department.Id) > 0
                                      select new
                                      {
                                          key = department.Id.ToString(),
                                          icon = department.IsUnit ? "fa fa-university  icon-university icon-color" : "fa fa-building  icon-building icon-color",
                                          title = department.Name,
                                          folder = existing,
                                        //  selected = (department.Id == request.KeyNodeSelected),
                                          active = (department.Id == request.KeyNodeSelected),
                                          ParentId = department.ParentId,
                                          extraClasses = department.Id < 0 ? "css_staff" : department.IsUnit ? "css_unit" : "css_dep",
                                          children = existing ? BuildDepartmentChildrenTree(departments, department.Id, request.KeyNodeSelected) : new List<object>()
                                      }).Cast<object>().ToList();

                //var category = _categoryService.GetAllCategory().ToList();
                var position = _positionService.GetAllPosition().ToList();

                //Get staff gender
                var staffGender = this.GetConfigurationByCode(Constants.StaffGender);
                var departmentLevel = this.GetConfigurationByCode(Constants.DepartmentLevel);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Departments = newdepartments,
                        Parents = departmentDropdown,
                        Positions = position,
                        Genders = staffGender,
                        Levels= departmentLevel,
                        DefaultPassword = appConfiguration.DefaultPassword
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetTreeUnitAndStaff");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetTreeUnit([FromBody] GetByPageRequest request)
        {
            try
            {
                if (!request.IsLoginUnitOnly)
                {
                    request.UnitId = Constants.UnitIdRoot;
                }
                else
                {
                    var staff = this.GetStaffLogin();
                    request.UnitId = staff.UnitId;
                }
                var departments = _departmentService.GetAllDepartmentByUnitId(request.UnitId).Where(x => request.IsUnitOnly? x.IsUnit:true).OrderBy(x => x.Level).ThenBy(x => x.SortOrder).ToList();
                var newdepartments = (from department in departments.Where(x => x.ParentId == 0 || x.Id == request.UnitId)
                                      let existing = departments.Count(x => x.ParentId == department.Id) > 0
                                      select new
                                      {
                                          key = department.Id.ToString(),
                                          icon = department.IsUnit ? "fa fa-university  icon-university icon-color" : "fa fa-building  icon-building icon-color",
                                          title = department.Name,
                                          folder = existing,
                                          //  selected = (department.Id == request.KeyNodeSelected),
                                          active = (department.Id == request.KeyNodeSelected),
                                          ParentId = department.ParentId,
                                          extraClasses = department.Id < 0 ? "css_staff" : department.IsUnit ? "css_unit" : "css_dep",
                                          children = existing ? BuildDepartmentChildrenTree(departments, department.Id, request.KeyNodeSelected) : new List<object>()
                                      }).Cast<object>().ToList();

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Departments = newdepartments
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetTreeUnitOnly");
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
                var departments = _departmentService.GetAllDepartment().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Departments = departments
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DepartmentGetAll");
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
                var department = _departmentService.GetDepartmentById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = department
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
        public IActionResult SaveDepartment([FromBody] DepartmentModel model)
        {
            try
            {
                Response response;
                if (model.Id == 0)
                {

                    response = _departmentService.Create(model);
                }
                else
                {
                    response = _departmentService.Update(model);
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
        public IActionResult LoadActionOfUnit([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                //
                var rights = _rightService.GetAllRight().ToList();
                //
                var actions = _departmentService.GetActionByUnitId(request.Id).ToList();
                rights = (from r in rights
                          join a in actions on r.Id equals a.RightId
                          select r).Distinct().ToList();
                rights.AddRange(actions.Select(x => new RightModel
                {
                    Id = x.Id *(-1),
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
                    Data = root
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



        [HttpPost]
        public IActionResult SaveActionOfUnit([FromBody] DepartmentModel model)
        {
            try
            {
                var response = _departmentService.SaveActionOfUnit(model);
                
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
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


        [HttpPost]
        public IActionResult DeleteDepartment([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _departmentService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteDepartment");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }


        [HttpPost]
        public IActionResult GetStaffById([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var staff = _staffService.GetStaffById(request.Id);
                var staffGender = this.GetConfigurationByCode(Constants.StaffGender);

                var roles = _staffService.GetRoleStaff(request.Id).ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = staff,
                    Roles =roles,
                    Genders = staffGender,
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
        public IActionResult SaveStaff([FromBody] StaffModel model)
        {
            try
            {
                
                //if (!string.IsNullOrWhiteSpace(model.BirthOfDayStr))
                //{
                //    DateTime? birthOfDay = DateTime.ParseExact(model.BirthOfDayStr, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                //    model.BirthOfDay = birthOfDay;
                //}
                //if (!string.IsNullOrWhiteSpace(model.IDCardDateStr))
                //{
                //    DateTime? idCardDate = DateTime.ParseExact(model.IDCardDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                //    model.IDCardDate = idCardDate;
                //}
                Response response;
                if (model.Id == 0)
                {
                    model.UserName = model.UserName.Trim();
                    model.Password = appConfiguration.DefaultPassword.ComputeSha256Hash();
                    response = _staffService.Create(model);
                }
                else
                {
                    response = _staffService.Update(model);
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
        public IActionResult ResetPasswordStaff([FromBody] StaffModel model)
        {
            try
            {

                model.Password = appConfiguration.DefaultPassword.ComputeSha256Hash();
                Response response = _staffService.ResetPassword(model);
                
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
        public IActionResult StaffChangePassword([FromBody] StaffModel model)
        {
            try
            {
                int id= this.GetStaffIdLogin();
                if (id!= model.Id)
                {
                    return Ok(new
                    {
                        Message = "Sai tài khoản",
                        Success = false
                    });
                }
                if (string.IsNullOrWhiteSpace(model.NewPassword))
                {
                    return Ok(new
                    {
                        Message = "Mật khẩu mới không hợp lệ",
                        Success = false
                    });
                }
                if (model.NewPassword!= model.ConfirmPassword)
                {
                    return Ok(new
                    {
                        Message = "Mật khẩu mới không hợp lệ",
                        Success = false
                    });
                }
                Response response = _staffService.StaffResetPassword(model);

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
        public IActionResult SaveRoleOfStaff([FromBody] StaffModel model)
        {
            try
            {

                Response response = _staffService.SaveRoleOfStaff(model);

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
        public IActionResult DeleteStaff([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _staffService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteStaff");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }




        [HttpPost]
        public IActionResult SaveUserProfile([FromBody] StaffModel model)
        {
            try
            {

                //if (!string.IsNullOrWhiteSpace(model.BirthOfDayStr))
                //{
                //    DateTime? birthOfDay = DateTime.ParseExact(model.BirthOfDayStr, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                //    model.BirthOfDay = birthOfDay;
                //}
                //if (!string.IsNullOrWhiteSpace(model.IDCardDateStr))
                //{
                //    DateTime? idCardDate = DateTime.ParseExact(model.IDCardDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                //    model.IDCardDate = idCardDate;
                //}
                Response response;
                    response = _staffService.SaveUserProfile(model);
                
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
    }
}
