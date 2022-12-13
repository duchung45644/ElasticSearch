using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Services;

namespace WebApi.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    /// [EnableCors("CorsPolicy")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;
        private readonly IUserService _userService;

        private AppConfiguration appConfiguration;
        public UserController(IConfiguration configuration, ICommonService baseService, IUserService userService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _userService = userService;

            appConfiguration = new AppConfiguration(configuration);
        }
        //[HttpGet]
        //[Route("Login")]
        //public ActionResult Login()
        //{
        //    try
        //    {
        //        return Ok();
        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Error GetAllCate");
        //    }
        //}

        private static List<object> BuildRightChildrenTree(List<RightModel> rihgts, int id)
        {
            return (from right in rihgts.Where(x => x.ParentId == id)
                    let existing = rihgts.Count(x => x.ParentId == right.Id) > 0
                    select new
                    {
                        route = right.ActionLink,
                        name = right.NameOfMenu,
                        type = existing ? "sub" : "link",
                        children = existing ? BuildRightChildrenTree(rihgts, right.Id) : new List<object>()
                    }).Cast<object>().ToList();
        }

        [HttpPost]
        public IActionResult Login([FromBody] User model)
        {

            try
            {
                User response = _userService.Login(model);
                if (response == null)
                {
                    return Ok(new
                    {
                        Message = "Tài khoản hoặc mật khẩu không chính xác.",
                        Success = false
                    });
                }

                Logger.LogMonitor(new MonitorModel()
                {
                    Type = 1,
                    UserId = response.UserId,
                    Description = "Login hệ thống",
                    Object = "Login"
                });

                var lstRight = _userService.GetRight(response.UserId);
                if (!lstRight.Any())
                {

                    return Ok(new
                    {
                        Message = "Tài khoản chưa được phân quyền.",
                        Success = false
                    });
                }
                var menus = (from right in lstRight.Where(x => x.ParentId == 0)
                             let existing = lstRight.Count(x => x.ParentId == right.Id) > 0
                             select new
                             {
                                 route = right.ActionLink,
                                 name = right.NameOfMenu,
                                 type = existing ? "sub" : "link",
                                 icon = "description",
                                 children = existing ? BuildRightChildrenTree(lstRight, right.Id) : new List<object>()
                             }).Cast<object>().ToList();
                //
                var lstAction = _userService.GetAction(response.UserId);
                // var lstAssets = _userService.GetAssets(response.UserId);
                var userobj = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                var token = new JwtTokenBuilder()
                               .AddSecurityKey(JwtSecurityKey.Create(appConfiguration.JWT_Secret))
                               .AddSubject(response.UserName)
                               .AddIssuer("Niq.Security.Bearer")
                               .AddAudience("Niq.Security.Bearer")
                               .AddClaim(Policies.Admin, response.UserId.ToString())
                               .AddClaim(Policies.UserObject, userobj)
                               .AddExpiry(120)
                               .Build();

                response.Token = token.Value;
                return Ok(new
                {
                    Message = "Đăng nhập thành công.",
                    Success = true,
                    Data = response,
                    Rights = lstRight,
                    Menus = menus,
                    Actions = lstAction,
                    // Assets = lstAssets
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Login");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error Login:" + ex.Message);
            }
        }
        [HttpPost]
        public IActionResult GetAllStaff()
        {
            try
            {

                var staff = _userService.GetAllStaff();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = staff
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllBorrowrequest");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllstaffRenewalprofile()
        {
            try
            {

                var staff = _userService.GetAllstaffRenewalprofile();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = staff
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllBorrowrequest");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

    }
}
