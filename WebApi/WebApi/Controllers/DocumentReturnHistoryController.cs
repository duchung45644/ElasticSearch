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

    public class DocumentReturnHistoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICommonService _baseService;

        private readonly IDocumentReturnHistoryService _documentReturnHistoryService;
        private AppConfiguration appConfiguration;

        public DocumentReturnHistoryController(IConfiguration configuration,
            ICommonService baseService, IDocumentReturnHistoryService DocumentReturnHistoryService)
        {
            _baseService = baseService;
            _configuration = configuration;
            _documentReturnHistoryService = DocumentReturnHistoryService;
            appConfiguration = new AppConfiguration(configuration);
        }


        [HttpPost]
        public IActionResult GetDocumentReturnHistory([FromBody] GetByPageRequest request)
        {
            try
            { 
                var historyList = _documentReturnHistoryService.GetDocumentReturnHistory(request);
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = historyList
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "GetDocumentReturnHistory");
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
                var list = _documentReturnHistoryService.GetAllRegistrationListHistory().ToList();
                return Ok(new
                {
                    Message = "Thành công.",
                    Success = true,
                    Data = new
                    {
                        Recordtypes = list
                    }
                });

            }
            catch (Exception ex)
            {

                Logger.LogError(ex, "Get All Registration List History");
                return Ok(new
                {
                    Message = ex.Message,
                    Success = false
                });
            }
        }


        [HttpPost]
        public IActionResult GetHistoryDocumentByRegistrationId([FromBody] RegistrasionlistModel model)
        {
            try
            { 

                var inforBorrowSlip = _documentReturnHistoryService.GetHistoryDocumentByRegistrationId(model);

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


    }
}
