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
    public class ApproveController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IApproveService _approveService;
      
        private AppConfiguration appConfiguration;
        public ApproveController(IConfiguration configuration,
          
            IApproveService baseService)
        {
            _approveService = baseService;
            
            _configuration = configuration;
            appConfiguration = new AppConfiguration(configuration);
        }
       
        [HttpPost]
        public IActionResult GetAll([FromBody] GetByPageRequest request)

        {
            try
            {
                var approves = _approveService.GetAllApprove().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Approves = approves
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult GetAllApproveStatus0([FromBody] GetByPageRequest request)

        {
            try
            {
                var approves = _approveService.GetAllApproveStatus0(request.Id).ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Approves = approves
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult GetAllRecord([FromBody] GetByPageRequest request)

        {
            try
            {
                var approves = _approveService.GetAllRecord(request.Id).ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Approves = approves
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
       
        [HttpPost]
        public IActionResult GetAllRecordStatus([FromBody] GetByPageRequest request)

        {
            try
            {
                var approves = _approveService.GetAllRecordStatus(request.Id,request.Status).ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Approves = approves
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult ViewDetailRecordRefuse([FromBody] GetByPageRequest request)

        {
            try
            {
                var approves = _approveService.ViewDetailRecordRefuse(request.Id).ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Approves = approves
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
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
                var Approves = _approveService.GetByPage(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Approves
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ApproveGetAll");
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
                var Record = _approveService.GetByPageRecord(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Record
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ApproveGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]
        public IActionResult SaveApprove([FromBody] ApproveModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);

                if (model.Id == 0)
                {

                    response = _approveService.Create(model);
                }
                else
                {
                    response = _approveService.Update(model);
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
        public IActionResult UpdateApprove([FromBody] ApproveModel model)
        {
            try
            {
                Response response;
                string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
                model.CreatedUserId = Convert.ToInt32(userId);

              
            
                    response = _approveService.UpdateApprove(model);
              

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
                var Approve = _approveService.GetApproveById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = Approve
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
        public IActionResult DeleteApprove([FromBody] GetByIdRequest<int> request)
        {
            try
            {
                Response response = _approveService.Delete(request.Id);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,

                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "DeleteApprove");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
      
        [HttpPost]
        public IActionResult CancelRecordApprove(ApproveModel model)
        {
            try
            {
                Response response = _approveService.CancelRecordApprove(model);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ChangeStatus");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
       
        [HttpPost]
        public IActionResult DeleteRecordInApprove(RecordModel model)
        {
            try
            {
                Response response = _approveService.DeleteRecordInApprove(model);
                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "ChangeStatus");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });

            }
        }
        [HttpPost]
        public IActionResult GetAllStaff([FromBody] GetByPageRequest request)

        {
            try
            {
                var staffs = _approveService.GetAllStaff().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Staffs = staffs
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "PositionGetAll");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

    }
}
