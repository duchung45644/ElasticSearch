using System;
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

    public class RegistrasionlistController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;
        private readonly IDocofrequestService _docofrequestService;
        private readonly IRegistrasionlistService _RegistrasionlistService;
        private AppConfiguration appConfiguration;
        public RegistrasionlistController(IConfiguration configuration,
            ICacheProviderService CacheProvider,
            IConfigurationService configurationService,
            IStaffService staffService,
            IRegistrasionlistService RegistrasionlistService, IDocofrequestService docofrequestService) : base(configurationService, CacheProvider, configuration, staffService)
        {
            _docofrequestService = docofrequestService;
            _RegistrasionlistService = RegistrasionlistService;
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }
        
        [HttpPost]
        public IActionResult GetAllRegistrasionlist()
        {
            try
            {

                var registrasionlists = _RegistrasionlistService.GetAllRegistrasionlist();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = registrasionlists
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllRegistrasionlist");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllAttachmentOfDocument()
        {
            try
            {

                var staff = _RegistrasionlistService.GetAllAttachmentOfDocument();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = staff
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllAttachmentOfDocument");
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

                var registrasionlists = _RegistrasionlistService.GetByID(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = registrasionlists
                });
            }
            catch (Exception ex)
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
        public IActionResult GetByIDList([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var file = _RegistrasionlistService.GetByIDList(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByIDList");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult GetByIDList_Regis([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var file = _RegistrasionlistService.GetByIDList_Regis(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByIDList_Regis");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult GetByIDListPayRecord([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var file = _RegistrasionlistService.GetByIDListPayRecord(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByIDListPayRecord");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetByRegistrasionID([FromBody] GetByIdRequest<int>  request)
        {
            try
            {
                var registrasionlist = _RegistrasionlistService.GetByRegistrasionID(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = registrasionlist
                });
            }
            catch (Exception ex)
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
        public IActionResult GetByPageAll([FromBody] GetByPageRequest request)
        {
            try
            {
                var cates = _RegistrasionlistService.GetByPageAll(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cates
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RegistrasionlistGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }



        [HttpPost]
        public IActionResult Save([FromBody] RegistrasionlistModel model)
        
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (!string.IsNullOrWhiteSpace(model.AppointmentDateStr))
                {
                    model.AppointmentDate = DateTime.ParseExact(model.AppointmentDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                if (model.Id == 0)
                {
                    response = _RegistrasionlistService.Create(model);
                }
                else
                {
                    response = _RegistrasionlistService.Update(model);
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

        public IActionResult SaveList([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                //model.CreateUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {
                    response = _RegistrasionlistService.CreateList(model);
                }
                else
                {
                    response = _RegistrasionlistService.UpdateList(model);
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

        public IActionResult SaveBrowsing([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                //model.CreateUserId = Convert.ToInt32(userId);
                if (model.Id == 0)
                {
                    response = _RegistrasionlistService.CreateBrowing(model);
                }
                else
                {
                    response = _RegistrasionlistService.UpdateBrowing(model);
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
        public IActionResult SaveRenewwalProfile([FromBody] RegistrasionlistModel model)
        {
            try
            {

                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
                if (!string.IsNullOrWhiteSpace(model.ExtendDateStr))
                {
                    model.ExtendDate = DateTime.ParseExact(model.ExtendDateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                if (model.Id == 0)
                {
                    response = _RegistrasionlistService.CreateRenewalProfile(model);
                }
                else
                {
                    response = _RegistrasionlistService.UpdateRenewalProfile(model);
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
        public IActionResult SaveReturnrecord([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;

                var staff = this.GetStaffLogin();
                model.UnitId = staff.UnitId;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);
             
                    response = _RegistrasionlistService.CreateReturnRecord(model);
               
             
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
        public IActionResult ChangeRegistrasionlist([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                response = _RegistrasionlistService.ChangeRegistrasionlist(model);

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
        public IActionResult GetRecordByUnit([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var file = _RegistrasionlistService.GetRecordByUnit(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByRegistrasionlistId");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult Getfondbydepartment([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var file = _RegistrasionlistService.GetFondDepartment(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByRegistrasionlistId");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }



        [HttpPost]
        public IActionResult GetByRegistrasionlistId([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                var cate = _RegistrasionlistService.GetByRegistrasionlistId(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cate,
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetByRegistrasionlistId");
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
                Response response = _RegistrasionlistService.Delete(request.Id);


                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteRegistrasionlist");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult RowSelectionChangeLog([FromBody] RegistrasionlistModel model)
        {
            try
            {
                var file = _RegistrasionlistService.RowSelectionChangeLog(model);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CancelRegistrasionlist");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetRecordByUnitRenewalprofile([FromBody] RegistrasionlistModel model)
        {
            try
            {
                var file = _RegistrasionlistService.GetRecordByUnitRenewalprofile(model);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = file
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "CancelRegistrasionlist");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetAllFileCode()
        {
            try
            {

                var registrasionlists = _RegistrasionlistService.GetAllFileCode();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = registrasionlists
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
        public IActionResult GetAllFondName()
        {
            try
            {

                var registrasionlists = _RegistrasionlistService.GetAllFondName();

                return Ok(new
                {
                    Message = "Thành Công.",
                    Success = true,
                    Data = registrasionlists
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "GetAllRegistrasionlist");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult DeleteRegis(RegistrasionlistModel model)
        {
            try
            {
                Response response = _RegistrasionlistService.DeleteRegis(model);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteRegis");
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
                var cates = _RegistrasionlistService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = cates
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DocofrequestGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }


    }
}
