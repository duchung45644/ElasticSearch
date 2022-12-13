using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WebApi.Helper;
using System;
using WebApi.Models.Request;
using Microsoft.Extensions.Configuration;
using WebApi.Services;
using WebApi.Models;
using DocumentFormat.OpenXml.EMMA;
using System.Linq;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Policy = Policies.Admin)]

    public class ManagementApprovalController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IManagementApprovalService _managementApprovalService;
        private AppConfiguration appConfiguration;

        public ManagementApprovalController(IConfiguration configuration,
            ICommonService baseService, IManagementApprovalService ManagementApprovalService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _managementApprovalService = ManagementApprovalService;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetPageData([FromBody] GetByPageRequest request)
        {
            try
            { 
                var borrowSlipList = _managementApprovalService.GetPageData(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = borrowSlipList
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetBorrowSlipList");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult GetInforBorrowSlipById([FromBody] GetByIdRequest<int> request)
        {
            try
            {

                var inforBorrowSlip = _managementApprovalService.GetInforBorrowSlipById(request.Id);

                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = inforBorrowSlip
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
        public IActionResult ApprovalBorrowSlip([FromBody] RegistrasionlistModel model)
        {

            string userId = User.Claims.First(c => c.Type == Policies.Admin).Value;
            model.CreatedUserId = Convert.ToInt32(userId);

            try
            {
                Response response;
                response = _managementApprovalService.Approval(model);

                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,
                    response.ReturnId
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
        public IActionResult RefuseBorrowSlip([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                response = _managementApprovalService.RefuseBorrowSlip(model);

                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,
                    response.ReturnId
                });
            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "RefuseBorrowSlip");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

    }
}
