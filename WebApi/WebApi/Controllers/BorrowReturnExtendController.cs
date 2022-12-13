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
using System.Reflection;

namespace WebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Policy = Policies.Admin)]

    public class BorrowReturnExtendController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IBorrowReturnExtendService _BorrowReturnExtendService;
        private AppConfiguration appConfiguration;

        public BorrowReturnExtendController(IConfiguration configuration,
            ICommonService baseService, IBorrowReturnExtendService BorrowReturnExtendService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _BorrowReturnExtendService = BorrowReturnExtendService;
            appConfiguration = new AppConfiguration(configuration);
        }

        [HttpPost]
        public IActionResult GetBorrowReturnExtend([FromBody] GetByPageRequest request)
        {
            try
            { 
                var borrowReturnExtend = _BorrowReturnExtendService.GetBorrowReturnExtend(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = borrowReturnExtend
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
        public IActionResult AddBorrowerInfor([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                response = _BorrowReturnExtendService.AddBorrowerInfor(model);

                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,
                    response.ReturnId
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "AddBorrowerInfor");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult ExtendBorrowSlip([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                response = _BorrowReturnExtendService.ExtendBorrowSlip(model);

                return Ok(new
                {
                    Message = response.Message,
                    Success = response.Success,
                    response.ReturnId
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "AddBorrowerInfor");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]
        public IActionResult ReturnBorrowSlip([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                response = _BorrowReturnExtendService.ReturnBorrowSlip(model);

                return Ok(new
                {
                    Message = response.Message, 
                    Success = response.Success,
                    response.ReturnId
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "AddBorrowerInfor");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }

        [HttpPost]  
        public IActionResult RequestReturn([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                response = _BorrowReturnExtendService.RequestReturn(model);

                return Ok(new
                {
                    Message = response.Message, 
                    Success = response.Success,
                    response.ReturnId
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "RequestReturn");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
        [HttpPost]  
        public IActionResult RefuseRequestReturn([FromBody] RegistrasionlistModel model)
        {
            try
            {
                Response response;
                response = _BorrowReturnExtendService.RefuseRequestReturn(model);

                return Ok(new
                {
                    Message = response.Message, 
                    Success = response.Success,
                    response.ReturnId
                });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "RefuseRequestReturn");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }
    }
}
